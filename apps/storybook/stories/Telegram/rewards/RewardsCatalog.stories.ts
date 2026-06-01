import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta = {
  title: 'Telegram/Rewards/RewardsCatalog',
};

export default meta;
type Story = StoryObj;

const rewards = [
  { name: 'Free latte', pts: 120, merchant: 'Coffee Club', available: true },
  { name: '10% discount', pts: 200, merchant: 'Book Corner', available: true },
  { name: 'Pastry of the day', pts: 80, merchant: 'Bread & Co', available: true },
  { name: 'Cocktail glass', pts: 350, merchant: 'Bar Tender', available: false },
];

export const Catalog: Story = {
  render: () => ({
    setup: () => ({ rewards }),
    template: `
      <div style="background:var(--tg-bg,#fafaf7); width:390px; min-height:600px;
        font-family:'Onest',system-ui,sans-serif; border-radius:20px; overflow:hidden;
        border:1px solid var(--tg-line,#e7e6e1);">

        <div style="padding:20px 20px 12px;">
          <div style="font-size:20px; font-weight:700; color:var(--tg-ink,#15171b);">Rewards</div>
          <div style="font-size:13px; color:var(--tg-muted,#6a6e76); margin-top:4px;">
            Your balance: <strong style="color:var(--tg-accent,#2d7df6);">1,240 pts</strong>
          </div>
        </div>

        <div style="padding:0 16px 20px; display:flex; flex-direction:column; gap:10px;">
          <div v-for="r in rewards" :key="r.name"
            style="background:var(--tg-surface,#fff); border:1px solid var(--tg-line,#e7e6e1);
              border-radius:16px; padding:16px; display:flex; align-items:center; gap:14px;">

            <div style="width:48px; height:48px; border-radius:12px; font-size:24px;
              background:var(--tg-surface-sub,#f3f2ec); display:flex; align-items:center;
              justify-content:center; flex-shrink:0;">
              🎁
            </div>

            <div style="flex:1; min-width:0;">
              <div style="font-size:15px; font-weight:600; color:var(--tg-ink,#15171b);">{{ r.name }}</div>
              <div style="font-size:12px; color:var(--tg-muted,#6a6e76); margin-top:2px;">
                {{ r.merchant }}
              </div>
            </div>

            <div style="text-align:right; flex-shrink:0;">
              <div style="font-size:15px; font-weight:700;"
                :style="{ color: r.available ? 'var(--tg-success,#1f9d57)' : 'var(--tg-faint,#9a9da3)' }">
                {{ r.pts }} pts
              </div>
              <button :disabled="!r.available"
                :style="{
                  background: r.available ? 'var(--tg-accent,#2d7df6)' : 'var(--tg-surface-sub,#f3f2ec)',
                  color: r.available ? '#fff' : 'var(--tg-faint,#9a9da3)',
                  cursor: r.available ? 'pointer' : 'default',
                }"
                style="border:none; border-radius:8px; padding:6px 14px;
                  font-family:'Onest',system-ui,sans-serif; font-size:12px; font-weight:600;
                  margin-top:4px;">
                {{ r.available ? 'Claim' : 'Need more' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
