import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { MSelect } from '@mctlhq/ui';

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

// 0.21.0: __context--select wraps a native select (or an MSelect size="sm")
// so a course switcher sits after the "/" separator in the header's type.
const selectContext = `
  <div class="mctl-site-header__context mctl-site-header__context--select" data-context>
    <MSelect v-model="course" size="sm" :options="courses" aria-label="Course" data-select />
  </div>`;

// The real MSelect, so its scoped rules compete with site.css as in an app.
const selectSetup = () => ({
  course: ref('search'),
  courses: [
    { label: 'Agentic Web Search', value: 'search' },
    { label: 'Kubernetes basics', value: 'k8s' },
    { label: 'Terraform (coming soon)', value: 'tf', disabled: true },
  ],
});

const selectHeader = (extraClass = '', burger = false) => `
  <header class="mctl-site-header mctl-site-header--app ${extraClass}">
    <div class="mctl-site-container mctl-site-header__inner">
      <a class="mctl-site-brand" href="#"><span class="mctl-site-brand__accent">M</span>CTL</a>
      ${selectContext}
      <nav class="mctl-site-nav" id="site-nav-select" aria-label="Main">
        <a href="#" aria-current="page">Learn</a>
        <a href="#">Mistakes</a>
      </nav>
      ${burger ? '<button class="mctl-site-burger" type="button" aria-label="Menu" aria-controls="site-nav-select" aria-expanded="false"></button>' : ''}
    </div>
  </header>`;

const checkSelectContext = (canvasElement: HTMLElement) => {
  const ctx = canvasElement.querySelector<HTMLElement>('[data-context]')!;
  const select = canvasElement.querySelector<HTMLSelectElement>('[data-context] select')!;
  const cs = getComputedStyle(ctx);
  if (parseFloat(cs.paddingLeft) !== 0 || parseFloat(cs.paddingTop) !== 0)
    throw new Error('the select context keeps the button padding');
  if (cs.overflow !== 'visible') throw new Error(`the select context clips (${cs.overflow})`);
  const navSize = getComputedStyle(document.documentElement)
    .getPropertyValue('--site-nav-size')
    .trim();
  const probe = document.createElement('span');
  probe.style.fontSize = navSize;
  ctx.append(probe);
  const want = getComputedStyle(probe).fontSize;
  probe.remove();
  if (getComputedStyle(select).fontSize !== want)
    throw new Error(`select is ${getComputedStyle(select).fontSize}, --site-nav-size is ${want}`);
  if (!getComputedStyle(select).fontFamily.includes('Onest'))
    throw new Error('select does not use the display family');
  select.focus();
  const focused = getComputedStyle(select);
  if (focused.boxShadow === 'none') throw new Error('focused select has no focus shadow');
  if (focused.outlineStyle !== 'none') throw new Error('focused select draws an outline ring');
  select.blur();
};

export const ContextSelect: Story = {
  render: () => ({ components: { MSelect }, setup: selectSetup, template: page(selectHeader()) }),
  play: async ({ canvasElement }) => checkSelectContext(canvasElement),
};

// Below 768px with a burger, a plain __context is truncated with overflow
// hidden; the --select variant must not clip the focus shadow.
export const ContextSelectMobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    components: { MSelect },
    setup: selectSetup,
    template: page(selectHeader('', true)),
  }),
  play: async ({ canvasElement }) => {
    if (window.innerWidth > 767) throw new Error(`run below 768px, got ${window.innerWidth}px`);
    checkSelectContext(canvasElement);
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

// 0.20.1: --drawer-wide keeps the drawer up to 980px. The tablet viewport is
// 800px wide, which the default drawer (below 768px) does not cover.
export const DrawerWide: Story = {
  globals: { viewport: { value: 'tablet', isRotated: false } },
  parameters: { viewport: { defaultViewport: 'tablet' } },
  render: () => ({
    data: () => ({ open: false }),
    template: page(
      drawerTemplate.replace(
        'class="mctl-site-header mctl-site-header--app"',
        'class="mctl-site-header mctl-site-header--app mctl-site-header--drawer-wide"',
      ),
    ),
  }),
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector<HTMLElement>('.mctl-site-nav')!;
    const burger = canvasElement.querySelector<HTMLButtonElement>('[data-burger]')!;
    if (window.innerWidth < 768 || window.innerWidth > 980) {
      throw new Error(`run at a 768-980px viewport, got ${window.innerWidth}px`);
    }
    if (getComputedStyle(burger).display === 'none')
      throw new Error('burger is hidden at the tablet width with --drawer-wide');
    if (getComputedStyle(nav).position !== 'fixed')
      throw new Error('nav is not a drawer at the tablet width with --drawer-wide');
  },
};

// Regression: without --drawer-wide the same header is inline at the tablet width (800px).
export const DefaultDrawerEndsBelow768: Story = {
  globals: { viewport: { value: 'tablet', isRotated: false } },
  parameters: { viewport: { defaultViewport: 'tablet' } },
  render: () => ({
    data: () => ({ open: false }),
    template: page(drawerTemplate),
  }),
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector<HTMLElement>('.mctl-site-nav')!;
    if (getComputedStyle(nav).position === 'fixed')
      throw new Error('the default drawer reached 768px');
  },
};

// 0.20.2: an actions slot (theme toggle, avatar) with the burger INSIDE it. The
// pair sits at the right edge, in order, with the brand on one line. Placing
// the burger as a sibling after __actions is not covered: it would get the
// __inner gap (16px), not the actions gap (8px).
const actionsTemplate = (extraClass: string) => `
  <header class="mctl-site-header mctl-site-header--app${extraClass}" :data-nav-open="open ? '' : null">
    <div class="mctl-site-container mctl-site-header__inner">
      <a class="mctl-site-brand" href="#"><span class="mctl-site-brand__accent">M</span>CTL</a>
      <nav class="mctl-site-nav" id="site-nav" aria-label="Main">
        <a href="#" aria-current="page">Platform</a>
        <a href="#">Docs</a>
      </nav>
      <div class="mctl-site-header__actions" data-actions>
        <button type="button" aria-label="Toggle theme" data-theme-btn style="width:32px;height:32px;border:1px solid var(--surface-line);border-radius:var(--mctl-radius-pill);background:transparent;color:var(--surface-fg)">&#9680;</button>
        <button class="mctl-site-burger" type="button" aria-label="Menu" aria-controls="site-nav"
          :aria-expanded="open" data-burger @click="open = !open"></button>
      </div>
    </div>
  </header>`;

const checkActionsWithBurger = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const innerEl = canvasElement.querySelector('.mctl-site-header__inner')!;
  const inner = innerEl.getBoundingClientRect();
  const gutter = parseFloat(getComputedStyle(innerEl).paddingRight) || 0;
  const brandEl = canvasElement.querySelector('.mctl-site-brand')!;
  const brand = brandEl.getBoundingClientRect();
  const theme = canvasElement.querySelector('[data-theme-btn]')!.getBoundingClientRect();
  const burgerEl = canvasElement.querySelector('[data-burger]')!;
  const burger = burgerEl.getBoundingClientRect();
  if (getComputedStyle(brandEl).whiteSpace !== 'nowrap') throw new Error('the brand can wrap');
  if (getComputedStyle(burgerEl).flexShrink !== '0') throw new Error('the burger can shrink');
  if (theme.left < brand.right) throw new Error('actions overlap the brand');
  if (burger.left < theme.right) throw new Error('burger overlaps the theme toggle');
  if (burger.left - theme.right > 12) throw new Error('burger is not next to the actions');
  if (Math.abs(inner.right - gutter - burger.right) > 2)
    throw new Error('the burger is not at the right edge of the header content');
  if (burger.width < 39) throw new Error('burger is squashed');
};

export const ActionsWithBurger: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({ data: () => ({ open: false }), template: page(actionsTemplate('')) }),
  play: checkActionsWithBurger,
};

// The same pair under --drawer-wide, in the 768-980px range.
export const WideActionsWithBurger: Story = {
  globals: { viewport: { value: 'tablet', isRotated: false } },
  parameters: { viewport: { defaultViewport: 'tablet' } },
  render: () => ({
    data: () => ({ open: false }),
    template: page(actionsTemplate(' mctl-site-header--drawer-wide')),
  }),
  play: checkActionsWithBurger,
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

// Regression: /site.css floats with main, so a header with no burger (every
// site that has not migrated) must keep its inline nav below 768px.
export const NoBurgerKeepsInlineNav: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    template: page(`
      <header class="mctl-site-header">
        <div class="mctl-site-container mctl-site-header__inner">
          <a class="mctl-site-brand" href="#"><span class="mctl-site-brand__accent">M</span>CTL</a>
          <nav class="mctl-site-nav" aria-label="Main" data-nav>
            <a href="#" aria-current="page">Docs</a>
          </nav>
        </div>
      </header>`),
  }),
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector<HTMLElement>('[data-nav]')!;
    const cs = getComputedStyle(nav);
    if (cs.visibility !== 'visible' || cs.position === 'fixed') {
      throw new Error('a header without a burger lost its inline nav below 768px');
    }
  },
};
