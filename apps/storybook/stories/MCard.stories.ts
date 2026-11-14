import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MCard, MBadge, MButton, MPill } from '@mctlhq/ui';

const meta: Meta<typeof MCard> = {
  title: 'Components/MCard',
  component: MCard,
  tags: ['autodocs'],
  argTypes: {
    elevated: { control: 'boolean' },
    interactive: { control: 'boolean' },
    font: { control: 'select', options: ['mono', 'sans'] },
  },
  args: { elevated: false, interactive: false, font: 'mono' },
  render: (args) => ({
    components: { MCard },
    setup: () => ({ args }),
    template: `
      <MCard v-bind="args" style="max-width:360px;">
        <template #header>mctl-api</template>
        REST API and MCP server. Handles auth, tenant management, and incident routing.
      </MCard>
    `,
  }),
};

export default meta;
type Story = StoryObj<typeof MCard>;

export const Default: Story = {};
export const Elevated: Story = { args: { elevated: true } };

export const WithFooter: Story = {
  render: () => ({
    components: { MCard, MBadge },
    template: `
      <MCard style="max-width:360px;">
        <template #header>
          <span style="display:flex; align-items:center; justify-content:space-between;">
            mctl-agent
            <MBadge tone="ok" dot>operational</MBadge>
          </span>
        </template>
        Self-healing agent. Receives AlertManager webhooks, runs diagnostic skills,
        and opens fix PRs in mctl-gitops.
        <template #footer>agent.mctl.ai · Go 1.25</template>
      </MCard>
    `,
  }),
};

export const Grid: Story = {
  render: () => ({
    components: { MCard, MBadge },
    template: `
      <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:12px;">
        <MCard v-for="svc in services" :key="svc.name">
          <template #header>
            <span style="display:flex; align-items:center; justify-content:space-between;">
              {{ svc.name }}
              <MBadge :tone="svc.status === 'ok' ? 'ok' : 'warn'" dot>{{ svc.status }}</MBadge>
            </span>
          </template>
          {{ svc.desc }}
        </MCard>
      </div>
    `,
    setup: () => ({
      services: [
        { name: 'mctl-api', status: 'ok', desc: 'REST API + MCP server' },
        { name: 'mctl-agent', status: 'ok', desc: 'Self-healing agent' },
        { name: 'mctl-portal', status: 'warn', desc: 'Backstage developer portal' },
      ],
    }),
  }),
};

// 0.21.0: a course card built from media + MPill + actions. The media slot is
// full bleed (no padding, no divider, clipped by the card radius); the actions
// row wraps on narrow widths; font="sans" sets the display family.
const badge = (hue: string) =>
  `<div style="height:120px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--surface-elevated),color-mix(in srgb,var(${hue}) 18%,var(--surface-card)));">
     <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true"><polygon points="28,4 50,16 50,40 28,52 6,40 6,16" fill="none" stroke="var(--surface-fg-muted)" stroke-width="2"/></svg>
   </div>`;

export const CourseCard: Story = {
  render: () => ({
    components: { MCard, MButton, MPill },
    setup: () => ({ courses }),
    template: `
      <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:16px; max-width:880px;">
        <MCard v-for="c in courses" :key="c.title" as="article" font="sans" interactive data-course>
          <template #media><div v-html="c.media" /></template>
          <MPill :tone="c.tone">{{ c.status }}</MPill>
          <h3 style="margin:var(--mctl-space-3) 0 var(--mctl-space-2); font-size:var(--mctl-typography-font-size-lg); font-weight:var(--mctl-typography-font-weight-semibold); color:var(--surface-fg);">{{ c.title }}</h3>
          <p style="margin:0; color:var(--surface-fg-muted); font-size:var(--mctl-typography-font-size-sm); line-height:var(--mctl-typography-line-height-body);">{{ c.desc }}</p>
          <template #actions>
            <MButton variant="neutral" size="sm">{{ c.cta }}</MButton>
            <MButton variant="ghost" size="sm">Syllabus</MButton>
          </template>
        </MCard>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector<HTMLElement>('[data-course]')!;
    const media = card.querySelector<HTMLElement>('.m-card__media')!;
    const cardBox = card.getBoundingClientRect();
    const mediaBox = media.getBoundingClientRect();
    const border = parseFloat(getComputedStyle(card).borderTopWidth);
    if (Math.abs(mediaBox.top - cardBox.top - border) > 0.5)
      throw new Error('media does not start at the top edge of the card');
    if (Math.abs(mediaBox.width - (cardBox.width - 2 * border)) > 0.5)
      throw new Error('media is not full bleed');
    if (parseFloat(getComputedStyle(media).borderBottomWidth) !== 0)
      throw new Error('media carries a divider');
    if (card.tagName !== 'ARTICLE') throw new Error('as="article" did not render an article');
    if (!getComputedStyle(card).fontFamily.includes('Onest'))
      throw new Error('font="sans" did not set the display family');
    if (getComputedStyle(card.querySelector('.m-card__actions')!).flexWrap !== 'wrap')
      throw new Error('actions row does not wrap');
  },
};

const courses = [
  {
    title: 'Kubernetes basics',
    status: 'In progress',
    tone: 'accent',
    cta: 'Continue',
    desc: 'Pods, deployments and services, with a tenant of your own to break and fix.',
    media: badge('--accent'),
  },
  {
    title: 'GitOps with ArgoCD',
    status: 'New',
    tone: 'neutral',
    cta: 'Start',
    desc: 'Ship a change through a pull request and watch the cluster converge on it.',
    media: badge('--status-ok'),
  },
  {
    title: 'Incident response',
    status: 'Completed',
    tone: 'ok',
    cta: 'Review',
    desc: 'Read alerts, find the cause in logs and roll back a bad release safely.',
    media: badge('--status-warn'),
  },
];

// Text inside the media banner (a course code, a label) keeps its own
// line-height: two wrapped lines must not overlap.
export const MediaWithText: Story = {
  render: () => ({
    components: { MCard },
    template: `
      <MCard font="sans" style="max-width:240px;">
        <template #media>
          <div data-banner style="padding:var(--mctl-space-5); background:linear-gradient(135deg,var(--surface-elevated),color-mix(in srgb,var(--accent) 18%,var(--surface-card)));">
            <span style="font-size:var(--mctl-typography-font-size-xs); color:var(--surface-fg-muted);">K8S-101</span>
            <p data-two-lines style="margin:var(--mctl-space-1) 0 0; font-size:var(--mctl-typography-font-size-lg); font-weight:var(--mctl-typography-font-weight-semibold); color:var(--surface-fg);">Kubernetes basics for platform teams</p>
          </div>
        </template>
        Pods, deployments and services.
      </MCard>
    `,
  }),
  play: async ({ canvasElement }) => {
    const p = canvasElement.querySelector<HTMLElement>('[data-two-lines]')!;
    const cs = getComputedStyle(p);
    // 'normal' is the only non-numeric value; a collapsed 0px must stay 0.
    const lh =
      cs.lineHeight === 'normal' ? parseFloat(cs.fontSize) * 1.2 : parseFloat(cs.lineHeight);
    if (!(lh >= parseFloat(cs.fontSize)))
      throw new Error(`media text line-height is ${cs.lineHeight}`);
    const lines = Math.round(p.getBoundingClientRect().height / lh);
    if (lines < 2) throw new Error(`banner title should wrap to two lines, got ${lines}`);
    if (p.getBoundingClientRect().height < 2 * parseFloat(cs.fontSize))
      throw new Error('wrapped lines in media overlap');
  },
};

// A whole-card link: as="a" with interactive. No actions slot, since links
// cannot nest.
export const InteractiveLink: Story = {
  render: () => ({
    components: { MCard },
    template: `
      <MCard as="a" href="#" interactive font="sans" style="max-width:360px;">
        <template #header>Kubernetes basics</template>
        Pods, deployments and services.
      </MCard>
    `,
  }),
};
