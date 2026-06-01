import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta = {
  title: 'Telegram/Rewards/SuperAdmin',
};

export default meta;
type Story = StoryObj;

const merchants = [
  { name: 'Coffee Club', rules: 2, staff: 3, total: '12,480 pts' },
  { name: 'Book Corner', rules: 1, staff: 1, total: '4,200 pts' },
  { name: 'Bread & Co', rules: 3, staff: 2, total: '8,900 pts' },
  { name: 'Bar Tender', rules: 1, staff: 4, total: '21,560 pts' },
];

export const GlobalView: Story = {
  render: () => ({
    setup: () => ({ merchants }),
    template: `
      <div style="background:var(--tg-bg,#fafaf7); width:390px;
        font-family:'Onest',system-ui,sans-serif; border-radius:20px; overflow:hidden;
        border:1px solid var(--tg-line,#e7e6e1); padding:20px; display:flex;
        flex-direction:column; gap:20px;">

        <!-- Stats row -->
        <div style="font-size:20px; font-weight:700; color:var(--tg-ink,#15171b);">Program</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div v-for="stat in [
            { label: 'Total users', value: '1,284' },
            { label: 'Active merchants', value: '4' },
            { label: 'Points issued', value: '47.1k' },
            { label: 'Points redeemed', value: '12.3k' },
          ]" :key="stat.label"
            style="background:var(--tg-surface,#fff); border:1px solid var(--tg-line,#e7e6e1);
              border-radius:14px; padding:14px; display:flex; flex-direction:column; gap:4px;">
            <div style="font-size:22px; font-weight:700; color:var(--tg-ink,#15171b);">{{ stat.value }}</div>
            <div style="font-size:12px; color:var(--tg-muted,#6a6e76);">{{ stat.label }}</div>
          </div>
        </div>

        <!-- Merchants -->
        <div>
          <div style="font-size:15px; font-weight:700; color:var(--tg-ink,#15171b); margin-bottom:12px;">
            Merchants
          </div>
          <div v-for="m in merchants" :key="m.name"
            style="background:var(--tg-surface,#fff); border:1px solid var(--tg-line,#e7e6e1);
              border-radius:14px; padding:14px 16px; margin-bottom:8px;
              display:flex; align-items:center; justify-content:space-between;">
            <div>
              <div style="font-size:15px; font-weight:600; color:var(--tg-ink,#15171b);">{{ m.name }}</div>
              <div style="font-size:12px; color:var(--tg-muted,#6a6e76); margin-top:2px;">
                {{ m.rules }} rules · {{ m.staff }} staff
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:14px; font-weight:600; color:var(--tg-accent,#2d7df6);">
                {{ m.total }}
              </div>
              <div style="font-size:11px; color:var(--tg-faint,#9a9da3);">issued</div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
