import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta = {
  title: 'Telegram/Patterns/OutsideTelegram',
};

export default meta;
type Story = StoryObj;

export const GracefulDegradation: Story = {
  render: () => ({
    template: `
      <div style="background:var(--tg-bg,#fafaf7); width:390px; min-height:400px; border-radius:16px;
        display:flex; flex-direction:column; align-items:center; justify-content:center;
        padding:40px 24px; text-align:center; font-family:'Onest',system-ui,sans-serif; gap:16px;">
        <div style="font-size:48px;">📱</div>
        <h2 style="font-size:20px; font-weight:700; color:var(--tg-ink,#15171b); margin:0;">
          Open in Telegram
        </h2>
        <p style="font-size:15px; color:var(--tg-muted,#6a6e76); margin:0; line-height:1.6; max-width:280px;">
          MCTL Rewards is a Telegram Mini App and needs to run inside Telegram to work properly.
        </p>
        <a href="https://t.me/mctl_rewards_bot/app"
          style="display:inline-block; background:var(--tg-accent,#2d7df6); color:#fff;
            text-decoration:none; border-radius:12px; padding:14px 28px;
            font-size:15px; font-weight:600;">
          Open in Telegram
        </a>
        <p style="font-size:12px; color:var(--tg-faint,#9a9da3); margin:0;">
          Don't have Telegram?
          <a href="https://telegram.org" style="color:var(--tg-accent,#2d7df6);">Download it here.</a>
        </p>
      </div>
    `,
  }),
};

export const CodePattern: Story = {
  render: () => ({
    template: `
      <div style="font-family:'Onest',system-ui,sans-serif; max-width:560px;">
        <p style="font-size:14px; color:var(--tg-muted,#6a6e76); margin:0 0 16px; line-height:1.6;">
          Check <code style="background:var(--tg-surface-sub,#f3f2ec); padding:1px 6px;
          border-radius:4px; font-family:var(--font-mono);">initData</code> presence to detect
          the Telegram context. Show the landing/redirect outside Telegram, the full Mini App inside.
        </p>
        <pre style="background:var(--tg-surface-sub,#f3f2ec); border-radius:12px; padding:16px;
          font-family:var(--font-mono); font-size:12px; color:var(--tg-ink,#15171b); overflow:auto; margin:0;">// tg.ts
export const isTelegram = Boolean(
  window.Telegram?.WebApp?.initData
);

// main.ts / App.vue
if (!isTelegram) {
  // Render the &lt;OutsideTelegram&gt; screen
  // instead of the full Mini App
  renderOutsideView();
} else {
  renderApp();
}</pre>
      </div>
    `,
  }),
};
