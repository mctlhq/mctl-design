import type { Meta, StoryObj } from '@storybook/vue3-vite';

// Public-site header, 0.20.0: neutral active item, the --app variant (context
// picker, badge counter, actions) and the mobile burger + right drawer. The
// drawer is toggled by data-nav-open on the header, which every consumer
// (Nuxt, VitePress, Astro, static HTML) can set in a line of its own script.
const meta: Meta = { title: 'Foundations/Site Header', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;

const page = (header: string) => `
  <div style="background:var(--surface-bg);color:var(--surface-fg);font-family:var(--font-display);min-height:420px">
    ${header}
    <main class="mctl-site-container" style="padding-block:48px;color:var(--surface-fg-muted)">
      Page content sits under the sticky header.
    </main>
  </div>`;

const rgb = (el: Element, prop: 'color' | 'textDecorationColor') => getComputedStyle(el)[prop];

export const ActiveItem: Story = {
  render: () => ({
    template: page(`
      <header class="mctl-site-header">
        <div class="mctl-site-container mctl-site-header__inner">
          <a class="mctl-site-brand" href="#"><span class="mctl-site-brand__accent">M</span>CTL</a>
          <nav class="mctl-site-nav" aria-label="Main">
            <a href="#" aria-current="page" data-active>Platform</a>
            <a href="#" data-idle>Docs</a>
            <a href="#">Telegram</a>
          </nav>
        </div>
      </header>`),
  }),
  play: async ({ canvasElement }) => {
    const active = canvasElement.querySelector('[data-active]')!;
    const idle = canvasElement.querySelector('[data-idle]')!;
    const accent = getComputedStyle(canvasElement.querySelector('.mctl-site-brand__accent')!).color;
    const cs = getComputedStyle(active);
    if (cs.color === accent) throw new Error('active nav item uses the accent colour');
    if (cs.color === getComputedStyle(idle).color) {
      throw new Error('active nav item is not distinguished from an idle one');
    }
    if (!cs.textDecorationLine.includes('underline'))
      throw new Error('active nav item is not underlined');
    if (parseFloat(cs.textDecorationThickness) !== 2) {
      throw new Error(`active underline is ${cs.textDecorationThickness}, expected 2px`);
    }
    if (rgb(active, 'textDecorationColor') === accent)
      throw new Error('active underline uses the accent');
  },
};

export const AppVariant: Story = {
  render: () => ({
    template: page(`
      <header class="mctl-site-header mctl-site-header--app">
        <div class="mctl-site-container mctl-site-header__inner">
          <a class="mctl-site-brand" href="#"><span class="mctl-site-brand__accent">M</span>CTL</a>
          <button class="mctl-site-header__context" type="button" aria-haspopup="listbox" data-context>Agentic Web Search &#9662;</button>
          <nav class="mctl-site-nav" aria-label="Main">
            <a href="#" aria-current="page">Learn</a>
            <a href="#">Mistakes<span class="mctl-site-badge" data-badge>3</span></a>
          </nav>
          <div class="mctl-site-header__actions">
            <button type="button" aria-label="Toggle theme" style="width:32px;height:32px;border:1px solid var(--surface-line);border-radius:var(--mctl-radius-pill);background:transparent;color:var(--surface-fg)">&#9680;</button>
            <span style="width:32px;height:32px;border-radius:var(--mctl-radius-pill);background:var(--surface-card);border:1px solid var(--surface-line);display:inline-block"></span>
          </div>
        </div>
      </header>`),
  }),
  play: async ({ canvasElement }) => {
    const brand = canvasElement.querySelector('.mctl-site-brand')!.getBoundingClientRect();
    const ctx = canvasElement.querySelector('[data-context]')!.getBoundingClientRect();
    const nav = canvasElement.querySelector('.mctl-site-nav')!.getBoundingClientRect();
    if (ctx.left < brand.right) throw new Error('context picker overlaps the brand');
    if (ctx.left - brand.right > 24) throw new Error('context picker is not next to the brand');
    if (nav.left <= ctx.right) throw new Error('nav should sit to the right of the context picker');
    const badge = getComputedStyle(canvasElement.querySelector('[data-badge]')!);
    const accent = getComputedStyle(canvasElement.querySelector('.mctl-site-brand__accent')!).color;
    if (badge.color === accent || badge.borderTopColor === accent) {
      throw new Error('badge counter uses the accent colour');
    }
  },
};

const drawerTemplate = `
  <header class="mctl-site-header mctl-site-header--app" :data-nav-open="open ? '' : null">
    <div class="mctl-site-container mctl-site-header__inner">
      <a class="mctl-site-brand" href="#"><span class="mctl-site-brand__accent">M</span>CTL</a>
      <span class="mctl-site-chip">Beta</span>
      <nav class="mctl-site-nav" id="site-nav" aria-label="Main">
        <a href="#" aria-current="page">Platform</a>
        <a href="#">Docs</a>
        <a href="#">Telegram</a>
      </nav>
      <button class="mctl-site-burger" type="button" aria-label="Menu" aria-controls="site-nav"
        :aria-expanded="open" data-burger @click="open = !open"></button>
    </div>
  </header>`;

export const MobileDrawer: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    data: () => ({ open: false }),
    template: page(drawerTemplate),
  }),
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector<HTMLElement>('.mctl-site-nav')!;
    const burger = canvasElement.querySelector<HTMLButtonElement>('[data-burger]')!;
    if (getComputedStyle(burger).display === 'none') {
      throw new Error('burger is hidden below 768px (run this story at a mobile viewport)');
    }
    if (getComputedStyle(nav).visibility !== 'hidden')
      throw new Error('drawer is visible while closed');
    burger.click();
    await new Promise((r) => setTimeout(r, 400));
    const cs = getComputedStyle(nav);
    if (cs.visibility !== 'visible') throw new Error('drawer did not open');
    const box = nav.getBoundingClientRect();
    if (Math.round(box.right) !== window.innerWidth)
      throw new Error('drawer is not flush with the right edge');
    if (box.width > 300.5) throw new Error(`drawer is ${box.width}px wide, max is 300px`);
    if (burger.getAttribute('aria-expanded') !== 'true') throw new Error('aria-expanded not set');
  },
};

export const StaticRecipe: Story = {
  name: 'Static HTML recipe (alice, seerrsense)',
  render: () => ({
    template: page(`
      <header class="mctl-site-header">
        <div class="mctl-site-container mctl-site-header__inner">
          <a class="mctl-site-brand" href="#">
            <svg class="mctl-site-brand__mark" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/></svg>alice
          </a>
          <span class="mctl-site-chip">Beta</span>
          <nav class="mctl-site-nav" aria-label="Main" style="margin-left:auto">
            <a href="#" aria-current="page">Overview</a>
            <a href="#">Docs</a>
          </nav>
        </div>
      </header>`),
  }),
};
