import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta = {
  title: 'Telegram/Foundations/SafeAreas',
};

export default meta;
type Story = StoryObj;

export const Diagram: Story = {
  render: () => ({
    template: `
      <div style="font-family:'Onest',system-ui,sans-serif; max-width:420px;">
        <p style="font-size:14px; color:var(--tg-muted,#6a6e76); margin:0 0 20px; line-height:1.6;">
          Use <code style="background:var(--tg-surface-sub,#f3f2ec); padding:1px 6px; border-radius:4px;
          font-family:var(--font-mono);">viewport-fit=cover</code> and
          <code style="background:var(--tg-surface-sub,#f3f2ec); padding:1px 6px; border-radius:4px;
          font-family:var(--font-mono);">env(safe-area-inset-*)</code> to
          avoid content sitting behind notches and home indicators.
        </p>

        <!-- Phone diagram -->
        <div style="position:relative; width:280px; height:560px; margin:0 auto;
          background:var(--tg-surface,#fff); border:2px solid var(--tg-line,#e7e6e1);
          border-radius:40px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08);">

          <!-- Status bar / notch safe area -->
          <div style="position:absolute; top:0; left:0; right:0; height:44px;
            background:rgba(45,125,246,0.12); border-bottom:2px dashed var(--tg-accent,#2d7df6);
            display:flex; align-items:center; justify-content:center;">
            <span style="font-size:11px; font-weight:600; color:var(--tg-accent,#2d7df6);">
              safe-area-inset-top · 44px
            </span>
          </div>

          <!-- Content area label -->
          <div style="position:absolute; top:44px; bottom:34px; left:0; right:0;
            display:flex; align-items:center; justify-content:center; flex-direction:column; gap:8px;">
            <span style="font-size:13px; color:var(--tg-muted,#6a6e76);">content area</span>
            <span style="font-size:11px; color:var(--tg-faint,#9a9da3);">min-height: 100dvh</span>
          </div>

          <!-- Tab bar safe area -->
          <div style="position:absolute; bottom:0; left:0; right:0; height:34px;
            background:rgba(45,125,246,0.12); border-top:2px dashed var(--tg-accent,#2d7df6);
            display:flex; align-items:center; justify-content:center;">
            <span style="font-size:11px; font-weight:600; color:var(--tg-accent,#2d7df6);">
              safe-area-inset-bottom · 34px
            </span>
          </div>
        </div>

        <div style="margin-top:24px; border:1px solid var(--tg-line,#e7e6e1);
          border-radius:12px; overflow:hidden;">
          <div v-for="(item, i) in [
            { cls: '.tg-safe-top',    css: 'padding-top: max(12px, env(safe-area-inset-top, 0px))' },
            { cls: '.tg-safe-bottom', css: 'padding-bottom: max(16px, env(safe-area-inset-bottom, 0px))' },
            { cls: '.tg-safe-x',      css: 'padding-left/right: max(20px, env(...))' },
            { cls: '.tg-shell',       css: 'min-height: 100dvh + safe handling' },
          ]" :key="item.cls"
            :style="i > 0 ? 'border-top:1px solid var(--tg-line,#e7e6e1)' : ''"
            style="padding:12px 16px; display:grid; grid-template-columns:140px 1fr; gap:8px;">
            <code style="font-family:var(--font-mono); font-size:12px;
              color:var(--tg-accent,#2d7df6);">{{ item.cls }}</code>
            <span style="font-size:12px; color:var(--tg-muted,#6a6e76);">{{ item.css }}</span>
          </div>
        </div>
      </div>
    `,
  }),
};

export const ViewportSetup: Story = {
  render: () => ({
    template: `
      <div style="font-family:'Onest',system-ui,sans-serif; max-width:560px;
        display:flex; flex-direction:column; gap:16px;">
        <div>
          <h3 style="font-size:13px; font-family:var(--font-mono); text-transform:uppercase;
            letter-spacing:0.08em; color:var(--surface-fg-subtle); margin:0 0 8px;">index.html</h3>
          <pre style="background:var(--tg-surface-sub,#f3f2ec); border-radius:12px; padding:16px;
            font-family:var(--font-mono); font-size:12px; color:var(--tg-ink,#15171b); overflow:auto; margin:0;">&lt;meta name="viewport"
  content="width=device-width, initial-scale=1, viewport-fit=cover"&gt;
&lt;script src="https://telegram.org/js/telegram-web-app.js"&gt;&lt;/script&gt;</pre>
        </div>
        <div>
          <h3 style="font-size:13px; font-family:var(--font-mono); text-transform:uppercase;
            letter-spacing:0.08em; color:var(--surface-fg-subtle); margin:0 0 8px;">tg.ts</h3>
          <pre style="background:var(--tg-surface-sub,#f3f2ec); border-radius:12px; padding:16px;
            font-family:var(--font-mono); font-size:12px; color:var(--tg-ink,#15171b); overflow:auto; margin:0;">const wa = window.Telegram?.WebApp;
document.documentElement.dataset.theme = wa?.colorScheme ?? 'light';
wa?.onEvent('themeChanged', () => {
  document.documentElement.dataset.theme = wa.colorScheme;
});
wa?.ready();
wa?.expand();</pre>
        </div>
      </div>
    `,
  }),
};
