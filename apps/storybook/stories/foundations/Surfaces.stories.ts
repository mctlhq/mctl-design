import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta = {
  title: 'Foundations/Light & Dark Surfaces',
};

export default meta;
type Story = StoryObj;

// Renders both surfaces side by side regardless of the toolbar selection by
// pinning data-theme on each panel.
export const Surfaces: Story = {
  render: () => ({
    setup: () => ({
      themes: [
        { id: 'dark', label: 'Engineering — dark (default)' },
        { id: 'light', label: 'Editorial — light (paper)' },
      ],
    }),
    template: `
      <div style="display:flex; flex-direction:column; gap:24px; max-width:760px;">
        <p class="mctl-prose">
          The surface flips via <code>data-theme</code>. Components consume the
          semantic <code>--surface-*</code> and <code>--accent</code> variables,
          so the same markup renders correctly on either surface.
        </p>
        <div v-for="t in themes" :key="t.id" :data-theme="t.id"
          style="background:var(--surface-bg); color:var(--surface-fg);
          border:1px solid var(--surface-line); padding:24px;">
          <div style="font-family:var(--font-mono); font-size:11px;
            text-transform:uppercase; letter-spacing:0.12em;
            color:var(--surface-fg-subtle); margin-bottom:12px;">{{ t.label }}</div>
          <div style="display:flex; gap:12px; flex-wrap:wrap;">
            <div v-for="s in ['bg','elevated','card','line','line-strong','fg','fg-muted','fg-subtle']"
              :key="s" style="text-align:center;">
              <div :style="{ width:'56px', height:'56px',
                background:'var(--surface-' + s + ')',
                border:'1px solid var(--surface-line-strong)' }"></div>
              <code style="font-family:var(--font-mono); font-size:10px;
                color:var(--surface-fg-subtle); display:block; margin-top:4px;">{{ s }}</code>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
