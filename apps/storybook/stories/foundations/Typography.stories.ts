import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { fontFamily, fontWeight, fontSize, text } from '@mctlhq/tokens';

const meta: Meta = {
  title: 'Foundations/Typography',
};

export default meta;
type Story = StoryObj;

export const Scale: Story = {
  render: () => ({
    setup: () => ({
      families: Object.entries(fontFamily),
      weights: Object.entries(fontWeight),
      uiSizes: Object.entries(fontSize).filter(([, v]) => !String(v).includes('clamp')),
      styles: Object.entries(text),
    }),
    template: `
      <div style="display:flex; flex-direction:column; gap:40px; max-width:760px;">
        <section>
          <h3 style="font-family:var(--font-mono); text-transform:uppercase;
            letter-spacing:0.12em; font-size:12px; color:var(--surface-fg-subtle);">Type scale</h3>
          <div style="font-size:var(--mctl-typography-font-size-hero);
            line-height:var(--mctl-typography-line-height-hero);
            letter-spacing:var(--mctl-typography-letter-spacing-hero);
            font-family:var(--font-display); font-weight:600;">Hero display</div>
          <div style="font-size:var(--mctl-typography-font-size-section-title);
            line-height:var(--mctl-typography-line-height-section-title);
            font-family:var(--font-display);">Section title</div>
          <div style="font-size:var(--mctl-typography-font-size-stat);
            font-family:var(--font-mono);">56 stat</div>
          <div style="font-size:var(--mctl-typography-font-size-lede);
            line-height:var(--mctl-typography-line-height-lede);
            font-family:var(--font-editorial);">
            Lede paragraph — the standfirst voice of the page.
          </div>
          <div style="font-size:var(--mctl-typography-font-size-body);">Body text — 15–16px.</div>
          <div style="font-size:var(--mctl-typography-font-size-marker);
            font-family:var(--font-mono); text-transform:uppercase;
            letter-spacing:var(--mctl-typography-letter-spacing-marker);
            color:var(--surface-fg-subtle);">S/00 · marker / eyebrow</div>
        </section>

        <section>
          <h3 style="font-family:var(--font-mono); text-transform:uppercase;
            letter-spacing:0.12em; font-size:12px; color:var(--surface-fg-subtle);">UI sizes</h3>
          <div v-for="[name, size] in uiSizes" :key="name"
            :style="{ fontFamily: 'var(--font-display)', fontSize: size, marginBottom: '6px' }">
            {{ name }} — {{ size }}
          </div>
        </section>

        <section>
          <h3 style="font-family:var(--font-mono); text-transform:uppercase;
            letter-spacing:0.12em; font-size:12px; color:var(--surface-fg-subtle);">Text styles</h3>
          <div v-for="[name, style] in styles" :key="name"
            :style="{
              fontFamily: style.family,
              fontSize: style.size,
              fontWeight: style.weight,
              lineHeight: style.lineHeight,
              letterSpacing: style.letterSpacing,
              marginBottom: '16px',
              color: name === 'bodyMuted' ? 'var(--surface-fg-muted)' : 'var(--surface-fg)',
            }">
            {{ name }} — The platform team is now an agent.
          </div>
        </section>

        <section>
          <h3 style="font-family:var(--font-mono); text-transform:uppercase;
            letter-spacing:0.12em; font-size:12px; color:var(--surface-fg-subtle);">Families</h3>
          <div v-for="[name, stack] in families" :key="name"
            :style="{ fontFamily: stack, fontSize: '20px', marginBottom: '8px' }">
            {{ name }} — The platform team is now an agent.
          </div>
        </section>

        <section>
          <h3 style="font-family:var(--font-mono); text-transform:uppercase;
            letter-spacing:0.12em; font-size:12px; color:var(--surface-fg-subtle);">Weights</h3>
          <div v-for="[name, weight] in weights" :key="name"
            :style="{ fontWeight: weight, fontSize: '20px', fontFamily: 'var(--font-display)' }">
            {{ name }} ({{ weight }}) — Boring on purpose.
          </div>
        </section>
      </div>
    `,
  }),
};
