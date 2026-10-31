import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta = { title: 'Foundations/Public Sites' };
export default meta;
type Story = StoryObj;

export const ShellAndReading: Story = {
  render: () => ({
    template: `
      <div style="display:grid;gap:32px">
        <section v-for="theme in ['dark', 'light']" :key="theme" :data-theme="theme"
          style="background:var(--surface-bg);color:var(--surface-fg);font-family:var(--font-display);border:1px solid var(--surface-line)">
          <header style="height:var(--site-header-height);background:var(--site-header-bg);border-bottom:1px solid var(--site-header-border);display:flex;align-items:center;justify-content:space-between;gap:24px;padding:0 var(--site-gutter)">
            <span style="display:flex;align-items:center;line-height:1;font-size:var(--site-wordmark-size);font-weight:var(--site-wordmark-weight);letter-spacing:var(--site-wordmark-tracking)"><span style="color:var(--accent);margin-right:var(--site-wordmark-accent-gap)">M</span>CTL</span>
            <span style="font-size:var(--site-nav-size);font-weight:var(--site-nav-weight);color:var(--surface-fg-muted)">Platform · Docs</span>
          </header>
          <article style="max-width:var(--mctl-layout-prose-width);padding:32px 20px;margin:auto;font-size:var(--text-prose-size);line-height:var(--text-prose-leading)">
            <h1 style="font-size:var(--text-prose-title-size);line-height:var(--text-prose-title-leading);font-weight:var(--text-prose-title-weight)">Deploy your first service</h1>
            <p>Readable documentation uses a steady 16px body with generous leading. Marketing headings use a separate fluid role; both share the same family and semantic colors.</p>
            <h2 style="font-size:var(--text-prose-section-size);font-weight:var(--text-prose-section-weight)">Service configuration</h2>
            <label style="display:grid;gap:8px;font-size:var(--text-label-size)">Service name
              <input aria-label="Service name" value="my-service" style="font:inherit;background:var(--control-bg);color:var(--surface-fg);border:1px solid var(--control-border);padding:12px" />
            </label>
            <input aria-label="Disabled service field" disabled value="Managed by the platform" style="margin-top:12px;font:inherit;background:var(--control-disabled-bg);color:var(--surface-fg-muted);border:1px solid var(--control-border);padding:12px" />
            <p style="background:var(--status-ok-soft);color:var(--status-ok-text);padding:12px">Deployment completed</p>
            <p style="background:var(--status-bad-soft);color:var(--status-bad-text);padding:12px">Check the repository and tag</p>
            <pre style="overflow:auto;background:var(--surface-card);border:1px solid var(--surface-line);padding:16px;font-family:var(--font-mono);font-size:var(--text-code-size)">mctl_get_service_status</pre>
          </article>
        </section>
      </div>
    `,
  }),
};

// site.css as the three public sites use it: one container for header, hero,
// sections and grid; full-bleed header and footer backgrounds. The play
// function checks the contract rather than only screenshotting it — the brand,
// the title of a hero with a visual, the first card and a --start section's
// title must share one left edge, which is exactly what drifted between
// mctl.ai, docs and tg before 0.15.0. From 0.18.0 a section's title and lede,
// the reading column and a hero without a visual are centred by default: they
// must share the content box's centre line. The same holds for a --stacked
// hero, whose visual must also sit under the text rather than beside it.
export const SiteShell: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => ({
    template: `
      <div style="background:var(--surface-bg);color:var(--surface-fg);font-family:var(--font-display)">
        <header class="mctl-site-header">
          <div class="mctl-site-container mctl-site-header__inner">
            <a class="mctl-site-brand" href="#" data-edge="brand"><span class="mctl-site-brand__accent">M</span>CTL</a>
            <nav class="mctl-site-nav" aria-label="Main">
              <a href="#" aria-current="page">Platform</a>
              <a href="#">Docs</a>
              <a href="#">Telegram</a>
            </nav>
          </div>
        </header>
        <main>
          <div class="mctl-site-container mctl-site-hero">
            <div class="mctl-site-hero__text">
              <p class="mctl-site-hero__eyebrow" data-rhythm="eyebrow">Platform</p>
              <h1 class="mctl-site-hero__title" data-edge="hero" data-rhythm="title">Ship services, not tickets</h1>
              <p class="mctl-site-hero__lede" data-rhythm="lede">One platform for deploys, secrets and observability, driven from your AI assistant.</p>
              <div class="mctl-site-hero__actions" data-rhythm="actions">
                <a href="#" style="background:var(--accent);color:var(--accent-fg);padding:12px 20px;text-decoration:none;font-weight:600">Get started</a>
                <a href="#" style="color:var(--surface-fg)">Read the docs</a>
              </div>
              <p data-rhythm="meta" style="margin-bottom:0;font-size:var(--text-caption-size);color:var(--surface-fg-muted)">Free for one tenant</p>
            </div>
            <div class="mctl-site-hero__visual">
              <pre style="margin:0;width:100%;overflow:auto;background:var(--surface-card);border:1px solid var(--surface-line);padding:16px;font-family:var(--font-mono);font-size:var(--text-code-size)">mctl_deploy_service my-api 1.4.0</pre>
            </div>
          </div>
          <section class="mctl-site-container mctl-site-section" data-centre="grid-section">
            <h2 class="mctl-site-section__title" data-centre="grid-title">What you get</h2>
            <p class="mctl-site-section__lede" data-centre="grid-lede">Section titles and ledes are centred over the card grid.</p>
            <div class="mctl-site-grid">
              <div v-for="(t, i) in ['Deploys', 'Secrets', 'Observability']" :key="t" :data-edge="i === 0 ? 'card' : null"
                style="background:var(--surface-card);border:1px solid var(--surface-line);padding:20px">
                <h3 style="margin:0 0 8px;font-size:var(--text-title-size);font-weight:var(--text-title-weight)">{{ t }}</h3>
                <p style="margin:0;color:var(--surface-fg-muted)">Built from the same tokens on every site.</p>
              </div>
            </div>
          </section>
          <div class="mctl-site-container mctl-site-hero mctl-site-hero--stacked" data-centre="stacked">
            <div class="mctl-site-hero__text">
              <h2 class="mctl-site-hero__title" data-centre="stacked-title">Stacked hero</h2>
              <p class="mctl-site-hero__lede" data-centre="stacked-lede">One centred column at every width, with the visual under the text.</p>
              <div class="mctl-site-hero__actions" data-centre="stacked-actions">
                <a href="#" style="background:var(--accent);color:var(--accent-fg);padding:12px 20px;text-decoration:none;font-weight:600">Get started</a>
              </div>
            </div>
            <div class="mctl-site-hero__visual">
              <pre data-centre="stacked-visual" style="margin:0;width:100%;max-width:560px;overflow:auto;background:var(--surface-card);border:1px solid var(--surface-line);padding:16px;font-family:var(--font-mono);font-size:var(--text-code-size)">mctl_rollback_service my-api</pre>
            </div>
          </div>
          <section class="mctl-site-container mctl-site-section mctl-site-section--center" data-centre="section">
            <h2 class="mctl-site-section__title" data-centre="title">Request access</h2>
            <p class="mctl-site-section__lede" data-centre="lede">A section holding one narrow block centres it, with its title, instead of leaving the row empty beside it.</p>
            <form class="mctl-site-section__narrow" data-centre="narrow" style="display:grid;gap:12px;background:var(--surface-card);border:1px solid var(--surface-line);padding:20px" onsubmit="return false">
              <input aria-label="Email" placeholder="you@company.com" style="font:inherit;background:var(--control-bg);color:var(--surface-fg);border:1px solid var(--control-border);padding:12px" />
              <button type="submit" style="font:inherit;background:var(--accent);color:var(--accent-fg);border:0;padding:12px">Request access</button>
            </form>
          </section>
          <div class="mctl-site-container mctl-site-hero" data-centre="plain">
            <div class="mctl-site-hero__text">
              <h2 class="mctl-site-hero__title" data-centre="plain-title">Hero without a visual</h2>
              <p class="mctl-site-hero__lede" data-centre="plain-lede">Without a visual the hero is one centred column, like a stacked one.</p>
            </div>
          </div>
          <section class="mctl-site-container mctl-site-section" data-centre="prose-section">
            <div class="mctl-site-prose mctl-prose" data-centre="prose">
              <h2>Reading column</h2>
              <p>Security, privacy, terms and docs articles keep the 720px reading width, centred in the same container. Inline <code>code</code> and <a href="#">links</a> stay neutral; only the underline carries the accent.</p>
            </div>
          </section>
          <section class="mctl-site-container mctl-site-section mctl-site-section--start">
            <h2 class="mctl-site-section__title" data-edge="start">Left-aligned section</h2>
            <p class="mctl-site-section__lede" data-edge="start-lede">--start puts a section back on the brand's left edge.</p>
          </section>
        </main>
        <footer class="mctl-site-footer">
          <div class="mctl-site-container mctl-site-footer__inner">
            <nav class="mctl-site-footer__links" aria-label="Footer">
              <a href="#" data-footer-link>Security</a><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Status</a>
            </nav>
            <p class="mctl-site-footer__copy">MCTL</p>
          </div>
        </footer>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const left = (name: string) => {
      const el = canvasElement.querySelector(`[data-edge="${name}"]`);
      if (!el) throw new Error(`site shell: no [data-edge="${name}"]`);
      return Math.round(el.getBoundingClientRect().left);
    };
    const edge = left('brand');
    for (const name of ['hero', 'card', 'start', 'start-lede']) {
      if (left(name) !== edge) {
        throw new Error(`site shell: ${name} starts at ${left(name)}px, brand at ${edge}px`);
      }
    }
    const centre = (name: string) => {
      const el = canvasElement.querySelector(`[data-centre="${name}"]`);
      if (!el) throw new Error(`site shell: no [data-centre="${name}"]`);
      const box = el.getBoundingClientRect();
      if (/^(section|stacked|plain|grid-section|prose-section)$/.test(name)) {
        const pad = parseFloat(getComputedStyle(el).paddingLeft);
        return Math.round(box.left + pad + (box.width - 2 * pad) / 2);
      }
      // Text centred in its box: measure the text itself, not the block box.
      if (/(^|-)(title|lede|actions)$/.test(name)) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const text = range.getBoundingClientRect();
        return Math.round(text.left + text.width / 2);
      }
      return Math.round(box.left + box.width / 2);
    };
    const axis = centre('section');
    for (const name of ['title', 'lede', 'narrow']) {
      // One pixel of slack: text widths are fractional.
      if (Math.abs(centre(name) - axis) > 1) {
        throw new Error(
          `site shell: centred ${name} at ${centre(name)}px, content centre ${axis}px`,
        );
      }
    }
    const stackedAxis = centre('stacked');
    for (const name of ['stacked-title', 'stacked-lede', 'stacked-actions', 'stacked-visual']) {
      if (Math.abs(centre(name) - stackedAxis) > 1) {
        throw new Error(
          `site shell: stacked hero ${name} at ${centre(name)}px, content centre ${stackedAxis}px`,
        );
      }
    }
    const axes: Record<string, string[]> = {
      'grid-section': ['grid-title', 'grid-lede'],
      plain: ['plain-title', 'plain-lede'],
      'prose-section': ['prose'],
    };
    for (const [box, names] of Object.entries(axes)) {
      const boxAxis = centre(box);
      for (const name of names) {
        if (Math.abs(centre(name) - boxAxis) > 1) {
          throw new Error(
            `site shell: ${name} centred at ${centre(name)}px, content centre ${boxAxis}px`,
          );
        }
      }
    }
    const below = (upper: string, lower: string) =>
      canvasElement.querySelector(`[data-centre="${lower}"]`)!.getBoundingClientRect().top >=
      canvasElement.querySelector(`[data-centre="${upper}"]`)!.getBoundingClientRect().bottom;
    if (!below('stacked-actions', 'stacked-visual')) {
      throw new Error('site shell: the stacked hero visual is not under its text');
    }
    // Hero rhythm (0.19.0): the gaps grow down the stack.
    const rhythm = (name: string) =>
      canvasElement.querySelector(`[data-rhythm="${name}"]`)!.getBoundingClientRect();
    const gaps: [string, string, number][] = [
      ['eyebrow', 'title', 20],
      ['title', 'lede', 24],
      ['lede', 'actions', 40],
      ['actions', 'meta', 32],
    ];
    for (const [upper, lower, px] of gaps) {
      const gap = Math.round(rhythm(lower).top - rhythm(upper).bottom);
      if (gap !== px) {
        throw new Error(`site shell: ${upper} to ${lower} is ${gap}px, want ${px}px`);
      }
    }
    // Accent discipline: footer links and inline code are not accent-coloured.
    const colour = (el: Element) => getComputedStyle(el).color;
    const probe = document.createElement('span');
    probe.style.color = 'var(--accent-text)';
    canvasElement.appendChild(probe);
    const accentText = colour(probe);
    probe.style.color = 'var(--accent)';
    const accent = colour(probe);
    probe.remove();
    for (const [what, el] of [
      ['footer link', canvasElement.querySelector('[data-footer-link]')!],
      ['inline code', canvasElement.querySelector('[data-centre="prose"] code')!],
      ['prose link', canvasElement.querySelector('[data-centre="prose"] a')!],
    ] as const) {
      if (colour(el) === accent || colour(el) === accentText) {
        throw new Error(`site shell: ${what} is accent-coloured (${colour(el)})`);
      }
    }
    if (
      Math.round(
        canvasElement.querySelector('[data-centre="narrow"]')!.getBoundingClientRect().width,
      ) > 600
    ) {
      throw new Error('site shell: the narrow block is wider than 600px');
    }
  },
};
