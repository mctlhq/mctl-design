#!/usr/bin/env node
// Builds ./ds-bundle, the upload set for a Claude Design "design system" project.
//
// Why a custom builder: the stock /design-sync converter bundles React components, and this
// library is Vue 3. So the bundle carries what a design agent can use without importing
// anything: tokens, stylesheets, self-hosted fonts, a README with the conventions, and one
// static reference card per component (the story markup rendered with @vue/server-renderer).
//
// Usage: node scripts/build-design-sync.mjs [--out ds-bundle]
// Needs: `pnpm install` and `pnpm build` (reads packages/*/dist). Node >= 22.18 (runs the
// .stories.ts files directly via type stripping).
//
// Failure policy: a story that cannot be rendered is never dropped silently. Every failure is
// listed, and the build exits non-zero unless the story is named in KNOWN_UNRENDERABLE below.

import { createRequire } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outArg = process.argv.indexOf('--out');
const out = path.resolve(root, outArg > -1 ? process.argv[outArg + 1] : 'ds-bundle');

/** Stories that legitimately cannot render statically, each with the reason. */
const KNOWN_UNRENDERABLE = {};

const FONT_SPEC = {
  onest: { weights: [300, 400, 500, 600, 700, 800], italic: false },
  'jetbrains-mono': { weights: [400, 500, 600, 700], italic: false },
  'instrument-serif': { weights: [400], italic: true },
};
const FONT_SUBSETS = ['latin', 'cyrillic'];

const storybookDir = path.join(root, 'apps/storybook');
const requireFromStorybook = createRequire(path.join(storybookDir, 'package.json'));
const requireFromUi = createRequire(path.join(root, 'packages/ui/package.json'));

function need(file, hint) {
  if (!existsSync(file)) throw new Error(`missing ${path.relative(root, file)}: ${hint}`);
  return file;
}

function write(rel, content) {
  const file = path.join(out, rel);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, content);
}

function copy(src, rel) {
  const file = path.join(out, rel);
  mkdirSync(path.dirname(file), { recursive: true });
  cpSync(src, file, { recursive: true });
}

// ---------------------------------------------------------------------------------------------
// tokens, stylesheets, fonts
// ---------------------------------------------------------------------------------------------

function buildStyles() {
  const cssDist = path.join(root, 'packages/css/dist');
  const tokensDist = path.join(root, 'packages/tokens/dist');
  const hint = 'run `pnpm build` first';
  copy(need(path.join(tokensDist, 'tokens.css'), hint), 'tokens/tokens.css');
  copy(need(path.join(tokensDist, 'tokens.json'), hint), 'tokens/tokens.json');
  for (const name of ['theme', 'global', 'site', 'prose', 'telegram']) {
    copy(need(path.join(cssDist, `${name}.css`), hint), `tokens/${name}.css`);
  }
  copy(need(path.join(root, 'packages/ui/dist/mctl-ui.css'), hint), 'components/mctl-ui.css');
  copy(need(path.join(storybookDir, 'public/brand'), 'brand assets used by MLogo'), 'brand');
  write(
    'styles.css',
    [
      '/* MCTL design system: fonts, raw tokens, semantic theme, base. Order matters. */',
      '@import "./fonts/fonts.css";',
      '@import "./tokens/tokens.css";',
      '@import "./tokens/theme.css";',
      '@import "./tokens/global.css";',
      '@import "./tokens/site.css";',
      '@import "./tokens/prose.css";',
      '/* tokens/telegram.css is intentionally NOT imported (Telegram mini-app theme, --tg-* only). */',
      '',
    ].join('\n'),
  );
}

function buildFonts() {
  const faces = [];
  for (const [family, spec] of Object.entries(FONT_SPEC)) {
    const pkgJson = requireFromStorybook.resolve(`@fontsource/${family}/package.json`);
    const pkgDir = path.dirname(pkgJson);
    const sheets = spec.weights.flatMap((w) => [
      `${w}.css`,
      ...(spec.italic ? [`${w}-italic.css`] : []),
    ]);
    for (const sheet of sheets) {
      const css = readFileSync(need(path.join(pkgDir, sheet), 'pnpm install'), 'utf8');
      for (const block of css.match(/@font-face\s*\{[^}]*\}/g) ?? []) {
        const file = /url\(\.\/files\/([^)]+?\.woff2)\)/.exec(block)?.[1];
        const subset =
          file &&
          new RegExp(`-(${FONT_SUBSETS.join('|')})-\\d+-(normal|italic)\\.woff2$`).exec(file);
        if (!file || !subset) continue;
        copy(path.join(pkgDir, 'files', file), `fonts/files/${file}`);
        const rewritten = block
          .replace(/src:[^;]*;/, `src: url(./files/${file}) format('woff2');`)
          .replace(/font-display:\s*\w+/, 'font-display: swap');
        faces.push(`/* ${family} ${subset[1]} */\n${rewritten}`);
      }
    }
  }
  // 12 Onest + 8 JetBrains Mono + 2 Instrument Serif. A shortfall means a font file was not found.
  if (faces.length !== 22) throw new Error(`expected 22 font faces, built ${faces.length}`);
  write('fonts/fonts.css', `/* Self-hosted from @fontsource (OFL-1.1). */\n${faces.join('\n')}\n`);
}

// ---------------------------------------------------------------------------------------------
// reference cards
// ---------------------------------------------------------------------------------------------

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const humanize = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1 $2');

function listStoryFiles() {
  const base = path.join(storybookDir, 'stories');
  const found = [];
  (function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/^M[A-Za-z]+\.stories\.ts$/.test(entry.name)) found.push(full);
    }
  })(base);
  return found.sort();
}

function cardHtml({ name, group, panels }) {
  const css = [
    'body{padding:24px;display:grid;gap:16px}',
    '.panel{background:var(--surface-bg);color:var(--surface-fg);border:1px solid var(--surface-line);border-radius:var(--mctl-radius-lg);padding:20px}',
    '.panel h3{margin:0 0 12px;font:500 12px var(--font-mono);color:var(--surface-fg-muted);text-transform:uppercase;letter-spacing:.08em}',
    '.row{display:flex;flex-wrap:wrap;gap:28px;align-items:flex-start}',
    'figure{margin:0;display:grid;gap:8px;justify-items:start;max-width:100%;min-width:0}',
    '.demo{max-width:100%;overflow:auto}',
    'figcaption{font:400 12px var(--font-mono);color:var(--surface-fg-subtle)}',
  ].join('');
  const note = `Reference render of the Vue component ${name}. Static markup from its Storybook stories, not importable; build with the tokens in styles.css.`;
  return `<!-- @dsCard group="${escapeHtml(group)}" -->
<!doctype html>
<html data-theme="dark" data-accent="terracotta"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(name)}</title>
<link rel="stylesheet" href="../../../styles.css">
<link rel="stylesheet" href="../../mctl-ui.css">
<style>${css}</style>
</head><body>
<p style="margin:0;font:400 13px var(--font-mono);color:var(--surface-fg-muted)">${escapeHtml(note)}</p>
${panels}
</body></html>
`;
}

async function buildCards() {
  const uiUrl = pathToFileURL(requireFromUi.resolve('vue')).href;
  const vue = await import(uiUrl);
  const { renderToString } = await import(
    pathToFileURL(requireFromUi.resolve('vue/server-renderer')).href
  );
  need(path.join(root, 'packages/ui/dist/index.js'), 'run `pnpm build` first');

  const cards = [];
  const failures = [];
  const skipped = [];
  for (const file of listStoryFiles()) {
    const mod = await import(pathToFileURL(file).href);
    const meta = mod.default;
    if (!meta?.component) {
      // Showcase stories (motion, tokens, patterns) have nothing to render as a component card.
      skipped.push(path.basename(file));
      continue;
    }
    if (!meta.title) {
      failures.push({ id: path.basename(file), reason: 'meta has a component but no title' });
      continue;
    }
    const segments = meta.title.split('/');
    const name = segments.at(-1);
    const group = segments.slice(0, -1).join(' / ') || 'Components';

    const cells = [];
    for (const [exportName, story] of Object.entries(mod)) {
      if (exportName === 'default') continue;
      const id = `${name}/${exportName}`;
      if (typeof story !== 'object' || story === null) {
        failures.push({
          id,
          reason: `export is a ${typeof story}, only object stories (CSF3) render`,
        });
        continue;
      }
      try {
        const args = { ...meta.args, ...story.args };
        const render = story.render ?? meta.render;
        let options = render
          ? render(args, { argTypes: meta.argTypes ?? {} })
          : { render: () => vue.h(meta.component, args) };
        if (typeof options === 'function') options = { render: options };
        // Stories reference site-root assets (/brand/...); cards sit three levels deep.
        const html = (await renderToString(vue.createSSRApp(options))).replace(
          /(["'(])\/brand\//g,
          '$1../../../brand/',
        );
        cells.push({ exportName, html });
      } catch (err) {
        failures.push({ id, reason: String(err?.message ?? err).split('\n')[0] });
      }
    }
    if (cells.length === 0) {
      failures.push({ id: name, reason: 'no story rendered' });
      continue;
    }
    const panels = ['dark', 'light']
      .map((theme) => {
        const figures = cells
          .map(
            (c) =>
              `<figure><div class="demo">${c.html}</div><figcaption>${escapeHtml(humanize(c.exportName))}</figcaption></figure>`,
          )
          .join('');
        return `<section data-theme="${theme}" class="panel"><h3>${theme}</h3><div class="row">${figures}</div></section>`;
      })
      .join('\n');
    const dir = `components/${group.replace(/ \/ /g, '-')}/${name}`;
    write(`${dir}/${name}.html`, cardHtml({ name, group, panels }));
    cards.push({ name, group, stories: cells.length });
  }
  return { cards, failures, skipped };
}

// ---------------------------------------------------------------------------------------------

// `out` is wiped below: refuse the repo itself or any parent of it (`--out .`, `--out ..`).
const repoInsideOut = path.relative(out, root);
if (repoInsideOut === '' || !repoInsideOut.startsWith('..')) {
  console.error(`refusing --out ${out}: it is, or contains, the repository at ${root}`);
  process.exit(1);
}
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
buildStyles();
buildFonts();
copy(
  need(path.join(root, '.design-sync/README.md'), 'README source is committed with the repo'),
  'README.md',
);
const { cards, failures, skipped } = await buildCards();

const unexpected = failures.filter((f) => !(f.id in KNOWN_UNRENDERABLE));
console.log(
  `ds-bundle: ${cards.length} component cards, ${cards.reduce((n, c) => n + c.stories, 0)} stories -> ${path.relative(process.cwd(), out) || '.'}`,
);
if (skipped.length > 0)
  console.log(
    `  note ${skipped.length} story file(s) without a component, no card: ${skipped.join(', ')}`,
  );
for (const f of failures) {
  const known = f.id in KNOWN_UNRENDERABLE;
  console.log(
    `  ${known ? 'skip' : 'FAIL'} ${f.id}: ${known ? KNOWN_UNRENDERABLE[f.id] : f.reason}`,
  );
}
if (unexpected.length > 0) {
  console.error(`${unexpected.length} story render failure(s) not in KNOWN_UNRENDERABLE`);
  process.exit(1);
}
