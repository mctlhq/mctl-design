import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MLogo } from '@mctlhq/ui';

const meta: Meta<typeof MLogo> = {
  title: 'Brand/MLogo',
  component: MLogo,
  tags: ['autodocs'],
  argTypes: {
    size: { control: { type: 'number', min: 24, max: 320, step: 8 } },
    glow: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: { size: 180, glow: true, label: 'MCTL' },
  render: (args) => ({
    components: { MLogo },
    setup: () => ({ args }),
    template: '<MLogo v-bind="args" />',
  }),
};

export default meta;
type Story = StoryObj<typeof MLogo>;

export const Default: Story = {};

export const Glow: Story = {
  args: { glow: true, size: 220 },
};

export const Sizes: Story = {
  render: () => ({
    components: { MLogo },
    template: `
      <div style="display:flex; align-items:flex-end; gap:32px; flex-wrap:wrap;">
        <MLogo :size="48" label="" />
        <MLogo :size="96" label="" />
        <MLogo :size="160" glow label="" />
      </div>
    `,
  }),
};

const favicons = [
  { file: 'favicon.svg', label: 'default' },
  { file: 'favicon-docs.svg', label: 'docs (D)' },
  { file: 'favicon-web.svg', label: 'web (W)' },
  { file: 'favicon-academy.svg', label: 'academy (A)' },
  { file: 'favicon-telegram.svg', label: 'telegram (T)' },
  { file: 'favicon-portal.svg', label: 'portal (P)' },
];

export const CdnKit: Story = {
  name: 'CDN kit',
  render: () => ({
    setup: () => ({ favicons }),
    template: `
      <div class="mctl-prose" style="max-width: 760px;">
        <h2>CDN brand kit</h2>
        <p>
          Hosted at <code>https://ui.mctl.ai/brand/</code>. Point
          <code>&lt;link rel="icon"&gt;</code> at a letter variant so product
          tabs are distinguishable; use the plain hex (or <code>MLogo</code>)
          in-app. Do not vendor copies.
        </p>
        <p style="font-size: 13px; color: var(--fg-muted, var(--fg2));">
          Letter badges are a filled terracotta hex with a cut-out glyph so
          they stay readable at 16px. The default mark is a hollow hex plus
          centre dot. Both bake <code>#e25a3c</code> (dark) /
          <code>#b83d28</code> (light) via <code>prefers-color-scheme</code>.
        </p>
        <div style="display:flex; flex-wrap:wrap; gap:28px; margin: 24px 0 8px;">
          <div v-for="item in favicons" :key="item.file" style="text-align:center; min-width:88px;">
            <div style="display:flex; align-items:flex-end; justify-content:center; gap:8px;">
              <img :src="'/brand/' + item.file" width="16" height="16" alt="" />
              <img :src="'/brand/' + item.file" width="32" height="32" alt="" />
              <img :src="'/brand/' + item.file" width="48" height="48" :alt="item.label" />
            </div>
            <div style="margin-top:8px; font-size:12px; font-family: var(--font-mono, ui-monospace, monospace);">{{ item.label }}</div>
            <div style="font-size:11px; opacity:0.7;">/brand/{{ item.file }}</div>
          </div>
        </div>
        <pre style="font-size:12px; overflow:auto;"><code>&lt;link rel="icon" type="image/svg+xml" href="https://ui.mctl.ai/brand/favicon-docs.svg"&gt;</code></pre>
        <p>
          <code>/brand/hex.svg</code> uses <code>currentColor</code> for inline
          SVG / CSS masks. An <code>&lt;img&gt;</code> of that file will not
          follow <code>--accent</code>.
        </p>
      </div>
    `,
  }),
};
