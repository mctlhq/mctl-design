import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta = {
  title: 'Telegram/Patterns/ThemeSync',
};

export default meta;
type Story = StoryObj;

export const ApproachA: Story = {
  name: 'Direction C (recommended)',
  render: () => ({
    template: `
      <div style="font-family:'Onest',system-ui,sans-serif; max-width:560px; display:flex; flex-direction:column; gap:20px;">
        <div style="background:var(--tg-surface,#fff); border:1px solid var(--tg-line,#e7e6e1);
          border-radius:16px; padding:20px;">
          <div style="font-size:13px; font-weight:600; color:var(--tg-accent,#2d7df6); margin-bottom:8px;">
            Recommended — mctl-loyalty approach
          </div>
          <p style="font-size:14px; color:var(--tg-muted,#6a6e76); margin:0 0 12px; line-height:1.5;">
            Maintain a fixed Direction C palette. Only switch light ↔ dark based on
            <code style="font-family:var(--font-mono); background:var(--tg-surface-sub,#f3f2ec);
            padding:1px 5px; border-radius:4px;">colorScheme</code>.
            Consistent brand identity across all themes.
          </p>
          <pre style="background:var(--tg-surface-sub,#f3f2ec); border-radius:10px; padding:14px;
            font-family:var(--font-mono); font-size:12px; color:var(--tg-ink,#15171b); overflow:auto; margin:0;">const wa = window.Telegram?.WebApp;
document.documentElement.dataset.theme =
  wa?.colorScheme ?? 'light';
wa?.onEvent('themeChanged', () => {
  document.documentElement.dataset.theme = wa.colorScheme;
});</pre>
        </div>

        <div style="background:var(--tg-surface,#fff); border:1px solid var(--tg-line,#e7e6e1);
          border-radius:16px; padding:20px;">
          <div style="font-size:13px; font-weight:600; color:var(--tg-muted,#6a6e76); margin-bottom:8px;">
            Alternative — mctl-pairdesk approach
          </div>
          <p style="font-size:14px; color:var(--tg-muted,#6a6e76); margin:0 0 12px; line-height:1.5;">
            Map Telegram's <code style="font-family:var(--font-mono); background:var(--tg-surface-sub,#f3f2ec);
            padding:1px 5px; border-radius:4px;">themeParams</code> directly to CSS vars.
            Adapts to every client theme automatically; less brand control.
          </p>
          <pre style="background:var(--tg-surface-sub,#f3f2ec); border-radius:10px; padding:14px;
            font-family:var(--font-mono); font-size:12px; color:var(--tg-ink,#15171b); overflow:auto; margin:0;">const tp = wa?.themeParams ?? {};
for (const [tgKey, cssVar] of Object.entries(map)) {
  const val = tp[tgKey];
  if (val) document.documentElement.style
    .setProperty(cssVar, val);
}</pre>
        </div>
      </div>
    `,
  }),
};

export const LiveDemo: Story = {
  render: () => ({
    setup() {
      return {};
    },
    template: `
      <div style="display:flex; gap:16px; font-family:'Onest',system-ui,sans-serif;">
        <div>
          <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.08em;
            font-family:var(--font-mono); color:var(--surface-fg-subtle); margin-bottom:8px;">Light</div>
          <div style="background:#fafaf7; border:1px solid #e7e6e1; border-radius:16px;
            width:180px; padding:16px; display:flex; flex-direction:column; gap:10px;">
            <div style="font-size:16px; font-weight:700; color:#15171b;">My Balance</div>
            <div style="font-size:28px; font-weight:700; color:#15171b;">1,240 pts</div>
            <div style="background:#2d7df6; color:#fff; border-radius:10px;
              padding:10px; text-align:center; font-weight:600; font-size:14px;">Show QR</div>
          </div>
        </div>
        <div>
          <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.08em;
            font-family:var(--font-mono); color:var(--surface-fg-subtle); margin-bottom:8px;">Dark</div>
          <div style="background:#17212b; border:1px solid #2a3744; border-radius:16px;
            width:180px; padding:16px; display:flex; flex-direction:column; gap:10px;">
            <div style="font-size:16px; font-weight:700; color:#f5f5f5;">My Balance</div>
            <div style="font-size:28px; font-weight:700; color:#f5f5f5;">1,240 pts</div>
            <div style="background:#4c92f8; color:#fff; border-radius:10px;
              padding:10px; text-align:center; font-weight:600; font-size:14px;">Show QR</div>
          </div>
        </div>
      </div>
    `,
  }),
};
