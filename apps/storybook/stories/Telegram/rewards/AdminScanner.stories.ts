import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MTgStatusBadge } from '@mctlhq/ui';

const meta: Meta = {
  title: 'Telegram/Rewards/AdminScanner',
};

export default meta;
type Story = StoryObj;

const requests = [
  { user: '@alice_k', reward: 'Free latte', pts: 120, status: 'pending', time: '2 min ago' },
  { user: '@boris_m', reward: '10% discount', pts: 200, status: 'completed', time: '1 hr ago' },
  { user: '@carol_x', reward: 'Pastry of the day', pts: 80, status: 'expired', time: 'Yesterday' },
];

export const ScannerPanel: Story = {
  render: () => ({
    components: { MTgStatusBadge },
    setup: () => ({ requests }),
    template: `
      <div style="background:var(--tg-bg,#fafaf7); width:390px;
        font-family:'Onest',system-ui,sans-serif; border-radius:20px; overflow:hidden;
        border:1px solid var(--tg-line,#e7e6e1);">

        <!-- Scanner area -->
        <div style="background:var(--tg-ink,#15171b); padding:32px; display:flex;
          flex-direction:column; align-items:center; gap:16px;">
          <div style="width:220px; height:220px; border:2px solid rgba(255,255,255,0.3);
            border-radius:20px; display:flex; align-items:center; justify-content:center;
            font-size:80px;">
            ⬛
          </div>
          <div style="font-size:14px; color:rgba(255,255,255,0.6);">
            Aim at the customer's QR code
          </div>
          <button style="background:var(--tg-accent,#2d7df6); color:#fff; border:none;
            border-radius:12px; padding:12px 32px; font-family:'Onest',system-ui,sans-serif;
            font-size:15px; font-weight:600; cursor:pointer;">
            Scan QR
          </button>
        </div>

        <!-- Redemption requests queue -->
        <div style="padding:16px 20px;">
          <div style="font-size:15px; font-weight:700; color:var(--tg-ink,#15171b); margin-bottom:12px;">
            Redemption requests
          </div>
          <div v-for="r in requests" :key="r.user"
            style="background:var(--tg-surface,#fff); border:1px solid var(--tg-line,#e7e6e1);
              border-radius:14px; padding:14px 16px; margin-bottom:8px;
              display:flex; flex-direction:column; gap:8px;">
            <div style="display:flex; align-items:center; justify-content:space-between;">
              <span style="font-size:14px; font-weight:600; color:var(--tg-ink,#15171b);">{{ r.user }}</span>
              <MTgStatusBadge :status="r.status" />
            </div>
            <div style="display:flex; align-items:center; justify-content:space-between;">
              <span style="font-size:13px; color:var(--tg-muted,#6a6e76);">{{ r.reward }}</span>
              <span style="font-size:13px; color:var(--tg-faint,#9a9da3);">{{ r.time }}</span>
            </div>
            <div v-if="r.status === 'pending'"
              style="display:flex; gap:8px; margin-top:4px;">
              <button style="flex:1; background:var(--tg-success,#1f9d57); color:#fff; border:none;
                border-radius:10px; padding:10px; font-family:'Onest',system-ui,sans-serif;
                font-size:14px; font-weight:600; cursor:pointer;">
                Approve ({{ r.pts }} pts)
              </button>
              <button style="background:var(--tg-surface-sub,#f3f2ec); color:var(--tg-danger,#d64545);
                border:none; border-radius:10px; padding:10px 16px;
                font-family:'Onest',system-ui,sans-serif; font-size:14px; cursor:pointer;">
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
