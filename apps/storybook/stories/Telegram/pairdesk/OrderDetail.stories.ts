import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MTgStatusBadge, MTgDeltaTag } from '@mctlhq/ui';

const meta: Meta = {
  title: 'Telegram/PairDesk/OrderDetail',
};

export default meta;
type Story = StoryObj;

export const BuyOrder: Story = {
  render: () => ({
    components: { MTgStatusBadge, MTgDeltaTag },
    template: `
      <div style="background:var(--tg-bg,#fafaf7); width:390px; font-family:'Onest',system-ui,sans-serif;
        border-radius:20px; overflow:hidden; border:1px solid var(--tg-line,#e7e6e1);">

        <!-- Header -->
        <div style="padding:20px; display:flex; align-items:center; gap:12px;">
          <button style="background:var(--tg-surface-sub,#f3f2ec); border:none; width:36px; height:36px;
            border-radius:50%; font-size:18px; cursor:pointer; display:flex; align-items:center;
            justify-content:center;">‹</button>
          <span style="font-size:18px; font-weight:700; color:var(--tg-ink,#15171b);">Order #a7f2c1</span>
          <MTgStatusBadge status="active" />
        </div>

        <!-- Rate hero -->
        <div style="background:var(--tg-surface,#fff); margin:0 16px; border-radius:16px;
          padding:20px; border:1px solid var(--tg-line,#e7e6e1); display:flex;
          flex-direction:column; gap:8px; margin-bottom:12px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="background:color-mix(in srgb,#1f9d57 12%,transparent); color:#1f9d57;
              font-size:13px; font-weight:700; padding:3px 10px; border-radius:8px;">BUY</span>
            <span style="font-size:16px; font-weight:600; color:var(--tg-ink,#15171b);">EUR / RUB</span>
          </div>
          <div style="display:flex; align-items:baseline; gap:10px;">
            <span style="font-size:32px; font-weight:700; color:var(--tg-ink,#15171b);">93.50 RUB</span>
            <MTgDeltaTag :delta="2.1" />
          </div>
        </div>

        <!-- Details grid -->
        <div style="margin:0 16px 12px; background:var(--tg-surface,#fff); border:1px solid var(--tg-line,#e7e6e1);
          border-radius:16px; overflow:hidden;">
          <div v-for="(row, i) in [
            ['Volume', '500 – 5,000 EUR'],
            ['Payment', 'SWIFT, SEPA'],
            ['Posted', 'Jun 1, 14:22'],
            ['Author', '@ivan_trader'],
            ['Rating', '⭐ 4.9 · 47 deals'],
          ]" :key="row[0]"
            :style="i > 0 ? 'border-top:1px solid var(--tg-line,#e7e6e1)' : ''"
            style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px;">
            <span style="font-size:13px; color:var(--tg-muted,#6a6e76);">{{ row[0] }}</span>
            <span style="font-size:14px; font-weight:500; color:var(--tg-ink,#15171b);">{{ row[1] }}</span>
          </div>
        </div>

        <!-- CTA -->
        <div style="padding:0 16px 20px;">
          <button style="width:100%; background:var(--tg-accent,#2d7df6); color:#fff; border:none;
            border-radius:14px; padding:16px; font-family:'Onest',system-ui,sans-serif;
            font-size:16px; font-weight:700; cursor:pointer;">
            Respond to this order
          </button>
        </div>
      </div>
    `,
  }),
};
