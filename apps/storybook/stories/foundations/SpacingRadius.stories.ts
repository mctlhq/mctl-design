import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { space, radius } from '@mctlhq/tokens';

const meta: Meta = {
  title: 'Foundations/Spacing & Radius',
};

export default meta;
type Story = StoryObj;

export const Scales: Story = {
  render: () => ({
    setup: () => ({
      spaces: Object.entries(space),
      radii: Object.entries(radius),
    }),
    template: `
      <div style="display:flex; flex-direction:column; gap:40px; max-width:760px;">
        <section>
          <h3 style="font-family:var(--font-mono); text-transform:uppercase;
            letter-spacing:0.12em; font-size:12px; color:var(--surface-fg-subtle);">Spacing scale</h3>
          <div v-for="[key, value] in spaces" :key="key"
            style="display:flex; align-items:center; gap:16px; margin-bottom:6px;">
            <code style="font-family:var(--font-mono); width:48px; color:var(--surface-fg-subtle);">{{ key }}</code>
            <div :style="{ width: value, height: '16px', background: 'var(--accent)' }"></div>
            <code style="font-family:var(--font-mono); color:var(--surface-fg-muted);">{{ value }}</code>
          </div>
        </section>

        <section>
          <h3 style="font-family:var(--font-mono); text-transform:uppercase;
            letter-spacing:0.12em; font-size:12px; color:var(--surface-fg-subtle);">Radius</h3>
          <div style="display:flex; gap:16px; flex-wrap:wrap;">
            <div v-for="[key, value] in radii" :key="key" style="text-align:center;">
              <div :style="{ width: '64px', height: '64px', background: 'var(--surface-card)',
                border: '1px solid var(--surface-line-strong)', borderRadius: value }"></div>
              <code style="font-family:var(--font-mono); font-size:11px;
                color:var(--surface-fg-muted); display:block; margin-top:6px;">{{ key }}</code>
            </div>
          </div>
        </section>
      </div>
    `,
  }),
};
