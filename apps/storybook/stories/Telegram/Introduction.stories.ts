import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta = {
  title: 'Telegram/Introduction',
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: () => ({
    template: `
      <div style="max-width:680px; font-family:'Onest',system-ui,sans-serif;">
        <h1 style="font-size:28px; font-weight:700; color:var(--tg-ink,#15171b); margin:0 0 8px;">
          MCTL Mini App Kit
        </h1>
        <p style="font-size:16px; color:var(--tg-muted,#6a6e76); margin:0 0 32px; line-height:1.6;">
          A shared design system for MCTL Telegram Mini Apps — Direction C tokens,
          mobile-first components, and screen-level patterns for Rewards and PairDesk.
        </p>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:32px;">
          <div style="background:var(--tg-surface,#fff); border:1px solid var(--tg-line,#e7e6e1);
            border-radius:18px; padding:20px;">
            <div style="font-size:24px; margin-bottom:8px;">🎨</div>
            <h3 style="font-size:15px; font-weight:600; color:var(--tg-ink,#15171b); margin:0 0 6px;">Foundations</h3>
            <p style="font-size:13px; color:var(--tg-muted,#6a6e76); margin:0; line-height:1.5;">
              Direction C palette, Onest typography, safe area insets, Telegram theme sync.
            </p>
          </div>
          <div style="background:var(--tg-surface,#fff); border:1px solid var(--tg-line,#e7e6e1);
            border-radius:18px; padding:20px;">
            <div style="font-size:24px; margin-bottom:8px;">🧩</div>
            <h3 style="font-size:15px; font-weight:600; color:var(--tg-ink,#15171b); margin:0 0 6px;">Components</h3>
            <p style="font-size:13px; color:var(--tg-muted,#6a6e76); margin:0; line-height:1.5;">
              MTgTabBar, MTgSheet, MTgStatusBadge, MTgDeltaTag, MTgEmptyState, MTgOrderCard.
            </p>
          </div>
          <div style="background:var(--tg-surface,#fff); border:1px solid var(--tg-line,#e7e6e1);
            border-radius:18px; padding:20px;">
            <div style="font-size:24px; margin-bottom:8px;">📐</div>
            <h3 style="font-size:15px; font-weight:600; color:var(--tg-ink,#15171b); margin:0 0 6px;">Patterns</h3>
            <p style="font-size:13px; color:var(--tg-muted,#6a6e76); margin:0; line-height:1.5;">
              Outside Telegram state, theme sync, role-based navigation.
            </p>
          </div>
          <div style="background:var(--tg-surface,#fff); border:1px solid var(--tg-line,#e7e6e1);
            border-radius:18px; padding:20px;">
            <div style="font-size:24px; margin-bottom:8px;">📱</div>
            <h3 style="font-size:15px; font-weight:600; color:var(--tg-ink,#15171b); margin:0 0 6px;">Screens</h3>
            <p style="font-size:13px; color:var(--tg-muted,#6a6e76); margin:0; line-height:1.5;">
              Reference screens for MCTL Rewards and PairDesk Mini Apps.
            </p>
          </div>
        </div>

        <h2 style="font-size:18px; font-weight:600; color:var(--tg-ink,#15171b); margin:0 0 12px;">Quick start</h2>
        <pre style="background:var(--tg-surface-sub,#f3f2ec); border-radius:12px; padding:16px;
          font-family:'JetBrains Mono',monospace; font-size:13px; color:var(--tg-ink,#15171b);
          overflow:auto; margin:0 0 16px;">import '@mctlhq/css/theme.css';
import '@mctlhq/css/telegram.css';

import { MTgTabBar, MTgStatusBadge, MTgOrderCard } from '@mctlhq/ui';</pre>

        <p style="font-size:13px; color:var(--tg-muted,#6a6e76); margin:0;">
          Add <code style="background:var(--tg-surface-sub,#f3f2ec); padding:2px 6px; border-radius:6px;">viewport-fit=cover</code>
          to your viewport meta and call <code style="background:var(--tg-surface-sub,#f3f2ec); padding:2px 6px; border-radius:6px;">Telegram.WebApp.expand()</code>
          on mount for full-screen layout.
        </p>
      </div>
    `,
  }),
};
