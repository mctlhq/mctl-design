import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta = {
  title: 'Telegram/Foundations/Typography',
};

export default meta;
type Story = StoryObj;

const scale = [
  { name: 'Display', size: '22px', weight: '700', usage: 'Screen titles, QR amount' },
  { name: 'Title', size: '18px', weight: '600', usage: 'Card headings, section labels' },
  { name: 'Body', size: '15px', weight: '400', usage: 'Primary content, descriptions' },
  { name: 'Label', size: '13px', weight: '500', usage: 'Metadata, secondary values' },
  { name: 'Caption', size: '11px', weight: '400', usage: 'Timestamps, helper text' },
  { name: 'Micro', size: '10px', weight: '500', usage: 'Tab bar labels, chip text' },
];

export const TypeScale: Story = {
  render: () => ({
    setup: () => ({ scale }),
    template: `
      <div style="font-family:'Onest',system-ui,sans-serif; max-width:600px;
        display:flex; flex-direction:column; gap:1px; background:var(--tg-line,#e7e6e1);">
        <div v-for="step in scale" :key="step.name"
          style="background:var(--surface-bg); padding:16px 20px;
          display:grid; grid-template-columns:100px 1fr 180px; align-items:center; gap:16px;">
          <div style="font-family:var(--font-mono); font-size:11px; color:var(--surface-fg-subtle);
            text-transform:uppercase; letter-spacing:0.08em;">{{ step.name }}</div>
          <div :style="{ fontSize: step.size, fontWeight: step.weight, color: 'var(--tg-ink,#15171b)' }">
            Onest {{ step.size }} / {{ step.weight }}
          </div>
          <div style="font-size:12px; color:var(--surface-fg-muted);">{{ step.usage }}</div>
        </div>
      </div>
    `,
  }),
};

export const FontFamilies: Story = {
  render: () => ({
    template: `
      <div style="max-width:600px; display:flex; flex-direction:column; gap:24px;">
        <div style="background:var(--tg-surface,#fff); border:1px solid var(--tg-line,#e7e6e1);
          border-radius:16px; padding:20px;">
          <div style="font-family:var(--font-mono); font-size:11px; color:var(--surface-fg-subtle);
            text-transform:uppercase; letter-spacing:0.08em; margin-bottom:12px;">
            Primary — Onest
          </div>
          <div style="font-family:'Onest',system-ui,sans-serif; font-size:24px; font-weight:700;
            color:var(--tg-ink,#15171b); margin-bottom:4px;">
            MCTL Rewards
          </div>
          <div style="font-family:'Onest',system-ui,sans-serif; font-size:15px;
            color:var(--tg-muted,#6a6e76); line-height:1.5;">
            Earn points with every purchase and redeem them for exclusive rewards from partner merchants.
          </div>
        </div>
        <div style="background:var(--tg-surface,#fff); border:1px solid var(--tg-line,#e7e6e1);
          border-radius:16px; padding:20px;">
          <div style="font-family:var(--font-mono); font-size:11px; color:var(--surface-fg-subtle);
            text-transform:uppercase; letter-spacing:0.08em; margin-bottom:12px;">
            Monospace — JetBrains Mono (rates, codes)
          </div>
          <div style="font-family:'JetBrains Mono',monospace; font-size:22px; font-weight:700;
            color:var(--tg-ink,#15171b); margin-bottom:4px;">
            93.50 RUB
          </div>
          <div style="font-family:'JetBrains Mono',monospace; font-size:13px;
            color:var(--tg-muted,#6a6e76);">
            Order #a7f2c1 · expires in 14:32
          </div>
        </div>
      </div>
    `,
  }),
};
