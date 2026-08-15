import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { shadow } from '@mctlhq/tokens';

const meta: Meta = {
  title: 'Foundations/Shadows',
};

export default meta;
type Story = StoryObj;

export const Overlay: Story = {
  render: () => ({
    setup: () => ({
      groups: Object.entries(shadow).map(([theme, steps]) => ({
        theme,
        steps: Object.entries(steps),
      })),
    }),
    template: `
      <div style="display:flex; flex-direction:column; gap:40px; font-family:var(--font-mono);">
        <section v-for="group in groups" :key="group.theme">
          <h3 style="text-transform:uppercase; letter-spacing:0.12em; font-size:12px;
            color:var(--surface-fg-subtle); margin:0 0 16px;">{{ group.theme }}</h3>
          <div style="display:flex; gap:32px; flex-wrap:wrap; padding:32px;
            background: var(--surface-bg); border: 1px solid var(--surface-line);">
            <div v-for="[name, value] in group.steps" :key="name"
              style="display:flex; flex-direction:column; align-items:center; gap:16px;">
              <div :style="{
                width: '120px',
                height: '80px',
                background: 'var(--surface-card)',
                borderRadius: '6px',
                boxShadow: value,
              }" />
              <div style="text-align:center;">
                <div style="font-size:12px; color:var(--surface-fg-muted); text-transform:uppercase; letter-spacing:0.1em;">
                  {{ name }}
                </div>
                <div style="font-size:11px; color:var(--surface-fg-subtle); margin-top:2px; max-width:180px;">
                  {{ value }}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    `,
  }),
};
