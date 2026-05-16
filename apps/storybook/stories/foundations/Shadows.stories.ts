import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { shadow } from '@mctlhq/tokens';

const meta: Meta = {
  title: 'Foundations/Shadows',
};

export default meta;
type Story = StoryObj;

export const Overlay: Story = {
  render: () => ({
    setup: () => ({ shadows: Object.entries(shadow) }),
    template: `
      <div style="display:flex; gap:32px; flex-wrap:wrap; padding:32px; font-family:var(--font-mono);">
        <div v-for="[name, value] in shadows" :key="name"
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
            <div style="font-size:11px; color:var(--surface-fg-subtle); margin-top:2px; max-width:160px;">
              {{ value }}
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
