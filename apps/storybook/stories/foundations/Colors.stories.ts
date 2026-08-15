import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { color, hue, accent, status, syntax } from '@mctlhq/tokens';

const meta: Meta = {
  title: 'Foundations/Colors',
};

export default meta;
type Story = StoryObj;

const flatten = (obj: Record<string, unknown>, prefix = ''): { label: string; value: string }[] => {
  const out: { label: string; value: string }[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const label = prefix ? `${prefix} · ${key}` : key;
    if (value !== null && typeof value === 'object') {
      out.push(...flatten(value as Record<string, unknown>, label));
    } else {
      out.push({ label, value: String(value) });
    }
  }
  return out;
};

const accentSwatches = Object.entries(accent)
  .filter(([name]) => name !== 'vermilion')
  .flatMap(([name, pair]) => flatten(pair, name));

const hueSwatches = flatten(hue);

export const Palette: Story = {
  render: () => ({
    setup: () => ({
      primitives: Object.entries(color),
      accents: accentSwatches,
      hues: hueSwatches,
      statuses: flatten(status),
      syntaxes: Object.entries(syntax),
    }),
    template: `
      <div style="display:flex; flex-direction:column; gap:32px; max-width:760px;">
        <section v-for="group in [
          { title: 'Primitives', items: primitives },
          { title: 'Accents (theme-split)', items: accents },
          { title: 'Hue ramps 50–900', items: hues },
          { title: 'Status', items: statuses },
          { title: 'Syntax', items: syntaxes },
        ]" :key="group.title">
          <h3 style="font-family:var(--font-mono); text-transform:uppercase;
            letter-spacing:0.12em; font-size:12px; color:var(--surface-fg-subtle);">
            {{ group.title }}
          </h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:1px;
            background:var(--surface-line); border:1px solid var(--surface-line);">
            <div v-for="item in group.items" :key="item[0] || item.label"
              style="background:var(--surface-card); padding:12px;">
              <div :style="{ background: Array.isArray(item) ? item[1] : item.value,
                height: '48px', border: '1px solid var(--surface-line)' }"></div>
              <div style="font-family:var(--font-mono); font-size:11px; margin-top:8px;
                color:var(--surface-fg);">{{ Array.isArray(item) ? item[0] : item.label }}</div>
              <div style="font-family:var(--font-mono); font-size:11px;
                color:var(--surface-fg-subtle);">{{ Array.isArray(item) ? item[1] : item.value }}</div>
            </div>
          </div>
        </section>
      </div>
    `,
  }),
};
