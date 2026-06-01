import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta = {
  title: 'Telegram/Rewards/CustomerQR',
};

export default meta;
type Story = StoryObj;

export const Screen: Story = {
  render: () => ({
    template: `
      <div style="background:var(--tg-bg,#fafaf7); width:390px; min-height:680px;
        font-family:'Onest',system-ui,sans-serif; border-radius:20px; overflow:hidden;
        border:1px solid var(--tg-line,#e7e6e1); display:flex; flex-direction:column;">

        <!-- Header -->
        <div style="padding:20px 20px 0; display:flex; align-items:center; justify-content:space-between;">
          <span style="font-size:20px; font-weight:700; color:var(--tg-ink,#15171b);">My QR</span>
          <span style="font-size:13px; color:var(--tg-muted,#6a6e76);">refreshes in 0:47</span>
        </div>

        <!-- Balance -->
        <div style="padding:20px; text-align:center;">
          <div style="font-size:13px; color:var(--tg-muted,#6a6e76); margin-bottom:4px;">Balance</div>
          <div style="font-size:40px; font-weight:700; color:var(--tg-ink,#15171b); letter-spacing:-1px;">
            1,240 pts
          </div>
        </div>

        <!-- QR code placeholder -->
        <div style="margin:0 40px; background:var(--tg-surface,#fff); border-radius:20px;
          border:1px solid var(--tg-line,#e7e6e1); padding:24px; display:flex; align-items:center;
          justify-content:center; flex-direction:column; gap:16px;">
          <div style="width:200px; height:200px; background:#15171b; border-radius:8px;
            display:flex; align-items:center; justify-content:center; font-size:60px;">
            ▣
          </div>
          <div style="font-family:'JetBrains Mono',monospace; font-size:12px;
            color:var(--tg-faint,#9a9da3); letter-spacing:0.1em;">
            MCTL-8745-1158
          </div>
        </div>

        <!-- Hint -->
        <div style="padding:20px; text-align:center;">
          <p style="font-size:13px; color:var(--tg-muted,#6a6e76); margin:0; line-height:1.5;">
            Show this QR at the cashier to earn points.<br>
            Tap and hold to show to the scanner.
          </p>
        </div>

        <!-- Recent transactions -->
        <div style="padding:0 20px 20px;">
          <div style="font-size:13px; font-weight:600; color:var(--tg-ink,#15171b); margin-bottom:12px;">
            Recent
          </div>
          <div v-for="tx in [
            { label: 'Coffee Club', pts: '+48', time: '14:22' },
            { label: 'Claim: Free latte', pts: '-120', time: 'Yesterday' },
            { label: 'Book Corner', pts: '+92', time: '2 days ago' },
          ]" :key="tx.label"
            style="display:flex; align-items:center; justify-content:space-between;
              padding:10px 0; border-bottom:1px solid var(--tg-line,#e7e6e1);">
            <div>
              <div style="font-size:14px; color:var(--tg-ink,#15171b);">{{ tx.label }}</div>
              <div style="font-size:12px; color:var(--tg-faint,#9a9da3);">{{ tx.time }}</div>
            </div>
            <div :style="{ color: tx.pts.startsWith('+') ? 'var(--tg-success,#1f9d57)' : 'var(--tg-danger,#d64545)',
              fontWeight: 600, fontSize: '15px' }">
              {{ tx.pts }} pts
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
