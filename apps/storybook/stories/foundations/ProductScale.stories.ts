import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { breakpoint, icon, opacity, focus, control, border } from '@mctlhq/tokens';

const meta: Meta = {
  title: 'Foundations/Product Scale',
};

export default meta;
type Story = StoryObj;

const rows = (obj: Record<string, string | number>) => Object.entries(obj);

export const Scale: Story = {
  render: () => ({
    setup: () => ({
      groups: [
        { title: 'Breakpoints', items: rows(breakpoint) },
        { title: 'Icon sizes', items: rows(icon) },
        { title: 'Opacity', items: rows(opacity) },
        { title: 'Focus', items: rows(focus) },
        { title: 'Control height', items: rows(control.height) },
        { title: 'Border width', items: rows(border.width) },
      ],
    }),
    template: `
      <div style="display:flex; flex-direction:column; gap:32px; max-width:560px; font-family:var(--font-mono);">
        <p class="mctl-prose" style="font-family:var(--font-display);">
          Product-UI tokens for agents: pick a named step instead of inventing
          <code>14px</code> or a one-off opacity.
        </p>
        <section v-for="group in groups" :key="group.title">
          <h3 style="text-transform:uppercase; letter-spacing:0.12em; font-size:12px;
            color:var(--surface-fg-subtle); margin:0 0 12px;">{{ group.title }}</h3>
          <div v-for="[name, value] in group.items" :key="name"
            style="display:flex; justify-content:space-between; gap:16px;
              padding:8px 0; border-bottom:1px solid var(--surface-line); font-size:13px;">
            <span style="color:var(--surface-fg);">{{ name }}</span>
            <span style="color:var(--surface-fg-muted);">{{ value }}</span>
          </div>
        </section>
      </div>
    `,
  }),
};
