#!/usr/bin/env node
// Runs the real nginx.conf in the pinned runtime image against a small
// fixture docroot and checks the routes that decide what a crawler sees.
//
// Why it exists: `location / { try_files ... /index.html }` answers every
// unknown path with the SPA shell and HTTP 200, so /sitemap.xml and
// /robots.txt were soft 404s (an HTML page where a crawler expects a file).
// A config read by eye cannot prove that; the server has to answer.
//
// Needs docker. The image is the one the Dockerfile ships, read from it, so
// this cannot test a different nginx than production runs.
import { execFileSync } from 'node:child_process';
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const image = /^FROM (nginxinc\/nginx-unprivileged\S+)/m.exec(
  readFileSync(join(root, 'Dockerfile'), 'utf8'),
)?.[1];
if (!image) {
  console.error('Could not read the nginx runtime image from the Dockerfile.');
  process.exit(1);
}

const dir = mkdtempSync(join(tmpdir(), 'check-nginx-'));
const docroot = join(dir, 'html');
mkdirSync(join(docroot, '0.1.0'), { recursive: true });
mkdirSync(join(docroot, 'brand'));
const SHELL = '<!doctype html><title>shell</title>';
writeFileSync(join(docroot, 'index.html'), SHELL);
writeFileSync(join(docroot, 'iframe.html'), '<!doctype html><title>frame</title>');
writeFileSync(join(docroot, 'mctl.css'), 'a{}');
writeFileSync(join(docroot, '0.1.0', 'mctl.css'), 'a{}');
writeFileSync(join(docroot, 'favicon.svg'), '<svg xmlns="http://www.w3.org/2000/svg"/>');
writeFileSync(join(docroot, 'brand', 'mark.svg'), '<svg xmlns="http://www.w3.org/2000/svg"/>');
writeFileSync(join(docroot, 'index.json'), '{}');
// nginx-unprivileged runs as uid 101; the bind mounts must be world-readable.
for (const p of [dir, docroot, join(docroot, '0.1.0'), join(docroot, 'brand')]) chmodSync(p, 0o755);
for (const f of ['index.html', 'iframe.html', 'mctl.css', 'favicon.svg', 'index.json']) {
  chmodSync(join(docroot, f), 0o644);
}
chmodSync(join(docroot, '0.1.0', 'mctl.css'), 0o644);
chmodSync(join(docroot, 'brand', 'mark.svg'), 0o644);

const name = `check-nginx-${process.pid}`;
const docker = (...args) => execFileSync('docker', args, { encoding: 'utf8' }).trim();
const cleanup = () => {
  try {
    docker('rm', '-f', name);
  } catch {
    // never started
  }
  rmSync(dir, { recursive: true, force: true });
};

// [path, expected status, expected content-type prefix or null, body check]
const cases = [
  ['/', 200, 'text/html', (b) => b === SHELL],
  ['/iframe.html', 200, 'text/html', (b) => b.includes('frame')],
  ['/some/client/route', 200, 'text/html', (b) => b === SHELL],
  ['/robots.txt', 200, 'text/plain', (b) => /^User-agent: \*\nDisallow: \/iframe\.html\n$/.test(b)],
  ['/sitemap.xml', 404, null, (b) => !b.includes('<title>shell')],
  ['/sitemap.txt', 404, null, (b) => !b.includes('<title>shell')],
  ['/favicon.ico', 404, null, (b) => !b.includes('<title>shell')],
  ['/does-not-exist.txt', 404, null, (b) => !b.includes('<title>shell')],
  ['/missing/page.html', 404, null, (b) => !b.includes('<title>shell')],
  ['/missing.js', 404, null, (b) => !b.includes('<title>shell')],
  ['/mctl.css', 200, 'text/css', () => true],
  ['/0.1.0/mctl.css', 200, 'text/css', () => true],
  ['/favicon.svg', 200, 'image/svg+xml', () => true],
  ['/brand/mark.svg', 200, 'image/svg+xml', () => true],
  ['/index.json', 200, 'application/json', () => true],
  ['/healthz', 200, 'text/plain', () => true],
];

let failures = 0;
try {
  docker(
    'run',
    '-d',
    '--name',
    name,
    '-p',
    '127.0.0.1::8080',
    '-v',
    `${join(root, 'nginx.conf')}:/etc/nginx/conf.d/default.conf:ro`,
    '-v',
    `${join(root, 'security-headers.conf')}:/etc/nginx/snippets/security-headers.conf:ro`,
    '-v',
    `${docroot}:/usr/share/nginx/html:ro`,
    image,
  );
  // The published port can be unreadable for a moment after `run -d`, and an
  // empty answer turns into http://127.0.0.1:/ (port 80). Poll for a number.
  let port = '';
  let up = false;
  let lastErr;
  for (let i = 0; i < 100 && !up; i++) {
    if (!/^\d+$/.test(port)) {
      port = docker('port', name, '8080/tcp').split('\n')[0].split(':').pop();
    }
    if (/^\d+$/.test(port)) {
      try {
        up = (await fetch(`http://127.0.0.1:${port}/healthz`)).ok;
      } catch (e) {
        lastErr = e; // mapping can be up before nginx accepts
      }
    }
    if (!up) await new Promise((r) => setTimeout(r, 200));
  }
  if (!up) {
    console.error(docker('logs', name), String(lastErr?.cause ?? lastErr ?? 'no port'));
    throw new Error('nginx did not come up (config rejected?)');
  }

  for (const [path, status, type, body] of cases) {
    const res = await fetch(`http://127.0.0.1:${port}${path}`, { redirect: 'manual' });
    const text = await res.text();
    const ct = res.headers.get('content-type') ?? '';
    const ok = res.status === status && (type === null || ct.startsWith(type)) && body(text);
    if (!ok) failures++;
    console.log(
      `${ok ? 'ok  ' : 'FAIL'} ${path} -> ${res.status} ${ct || '-'} (want ${status}${type ? ' ' + type : ''})`,
    );
  }
} finally {
  cleanup();
}

if (failures) {
  console.error(`\n${failures} route check(s) failed.`);
  process.exit(1);
}
console.log('\nAll nginx route checks passed.');
