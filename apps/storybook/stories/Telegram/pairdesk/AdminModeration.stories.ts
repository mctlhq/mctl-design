import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta = {
  title: 'Telegram/PairDesk/AdminModeration',
};

export default meta;
type Story = StoryObj;

const pending = [
  { name: 'Denis V.', handle: '@denisv', joined: '2 min ago', deals: 0 },
  { name: 'Elena K.', handle: '@elena_k', joined: '1 hr ago', deals: 0 },
  { name: 'Fedor P.', handle: '@fedor_p', joined: '3 hr ago', deals: 0 },
];

const auditLog = [
  { action: 'approved', user: '@alice_k', by: '@admin', time: '14:22' },
  { action: 'rejected', user: '@badactor', by: '@admin', time: '14:10' },
  { action: 'approved', user: '@boris_m', by: '@admin', time: 'Yesterday' },
];

export const ApprovalQueue: Story = {
  render: () => ({
    setup: () => ({ pending }),
    template: `
      <div style="background:var(--tg-bg,#fafaf7); width:390px; font-family:'Onest',system-ui,sans-serif;
        border-radius:20px; padding:20px; border:1px solid var(--tg-line,#e7e6e1);
        display:flex; flex-direction:column; gap:16px;">

        <div>
          <div style="font-size:20px; font-weight:700; color:var(--tg-ink,#15171b);">Admin</div>
          <div style="font-size:13px; color:var(--tg-muted,#6a6e76); margin-top:4px;">
            {{ pending.length }} users awaiting approval
          </div>
        </div>

        <div v-for="u in pending" :key="u.handle"
          style="background:var(--tg-surface,#fff); border:1px solid var(--tg-line,#e7e6e1);
            border-radius:14px; padding:14px 16px; display:flex; flex-direction:column; gap:10px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:40px; height:40px; border-radius:50%; background:var(--tg-surface-sub,#f3f2ec);
              display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0;">
              👤
            </div>
            <div style="flex:1;">
              <div style="font-size:15px; font-weight:600; color:var(--tg-ink,#15171b);">{{ u.name }}</div>
              <div style="font-size:12px; color:var(--tg-muted,#6a6e76);">{{ u.handle }} · joined {{ u.joined }}</div>
            </div>
          </div>
          <div style="display:flex; gap:8px;">
            <button style="flex:1; background:var(--tg-success,#1f9d57); color:#fff; border:none;
              border-radius:10px; padding:10px; font-family:'Onest',system-ui,sans-serif;
              font-size:14px; font-weight:600; cursor:pointer;">
              Approve
            </button>
            <button style="background:var(--tg-surface-sub,#f3f2ec); color:var(--tg-danger,#d64545);
              border:none; border-radius:10px; padding:10px 20px;
              font-family:'Onest',system-ui,sans-serif; font-size:14px; cursor:pointer;">
              Reject
            </button>
          </div>
        </div>
      </div>
    `,
  }),
};

export const AuditLog: Story = {
  render: () => ({
    setup: () => ({ auditLog }),
    template: `
      <div style="background:var(--tg-bg,#fafaf7); width:390px; font-family:'Onest',system-ui,sans-serif;
        border-radius:20px; padding:20px; border:1px solid var(--tg-line,#e7e6e1);
        display:flex; flex-direction:column; gap:16px;">

        <div style="font-size:20px; font-weight:700; color:var(--tg-ink,#15171b);">Audit log</div>

        <div style="background:var(--tg-surface,#fff); border:1px solid var(--tg-line,#e7e6e1);
          border-radius:14px; overflow:hidden;">
          <div v-for="(entry, i) in auditLog" :key="entry.user + entry.time"
            :style="i > 0 ? 'border-top:1px solid var(--tg-line,#e7e6e1)' : ''"
            style="padding:12px 16px; display:flex; align-items:center; gap:10px;">
            <div :style="{
              width:'8px', height:'8px', borderRadius:'50%', flexShrink:0,
              background: entry.action === 'approved' ? 'var(--tg-success,#1f9d57)' : 'var(--tg-danger,#d64545)',
            }"></div>
            <div style="flex:1;">
              <span style="font-size:14px; color:var(--tg-ink,#15171b);">
                {{ entry.action.charAt(0).toUpperCase() + entry.action.slice(1) }}
              </span>
              <span style="font-size:14px; color:var(--tg-accent,#2d7df6);"> {{ entry.user }}</span>
            </div>
            <div style="text-align:right; flex-shrink:0;">
              <div style="font-size:12px; color:var(--tg-faint,#9a9da3);">{{ entry.by }}</div>
              <div style="font-size:11px; color:var(--tg-faint,#9a9da3);">{{ entry.time }}</div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
