import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta = {
  title: 'Telegram/Rewards/MerchantAdmin',
};

export default meta;
type Story = StoryObj;

const staff = [
  { name: 'Anna K.', role: 'Scanner', since: 'Jun 1' },
  { name: 'Boris M.', role: 'Scanner', since: 'May 28' },
  { name: 'Carol X.', role: 'Merchant admin', since: 'May 10' },
];

const rules = [
  { name: '1 pt per 50 RUB', status: 'active', limit: '200 pts/day' },
  { name: '2x weekend bonus', status: 'inactive', limit: '500 pts/day' },
];

export const StaffView: Story = {
  render: () => ({
    setup: () => ({ staff }),
    template: `
      <div style="background:var(--tg-bg,#fafaf7); width:390px;
        font-family:'Onest',system-ui,sans-serif; border-radius:20px; overflow:hidden;
        border:1px solid var(--tg-line,#e7e6e1); padding:20px; display:flex;
        flex-direction:column; gap:16px;">

        <div style="font-size:20px; font-weight:700; color:var(--tg-ink,#15171b);">Staff</div>

        <div v-for="s in staff" :key="s.name"
          style="background:var(--tg-surface,#fff); border:1px solid var(--tg-line,#e7e6e1);
            border-radius:14px; padding:14px 16px; display:flex; align-items:center; gap:12px;">
          <div style="width:40px; height:40px; border-radius:50%; background:var(--tg-accent-soft,#eaf1fe);
            display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0;">
            👤
          </div>
          <div style="flex:1;">
            <div style="font-size:15px; font-weight:600; color:var(--tg-ink,#15171b);">{{ s.name }}</div>
            <div style="font-size:12px; color:var(--tg-muted,#6a6e76);">{{ s.role }} · since {{ s.since }}</div>
          </div>
          <button style="background:var(--tg-surface-sub,#f3f2ec); color:var(--tg-danger,#d64545);
            border:none; border-radius:8px; padding:6px 14px;
            font-family:'Onest',system-ui,sans-serif; font-size:12px; cursor:pointer;">
            Remove
          </button>
        </div>

        <button style="background:var(--tg-accent,#2d7df6); color:#fff; border:none;
          border-radius:12px; padding:13px; width:100%;
          font-family:'Onest',system-ui,sans-serif; font-size:15px; font-weight:600; cursor:pointer;">
          + Add staff member
        </button>
      </div>
    `,
  }),
};

export const AccrualRules: Story = {
  render: () => ({
    setup: () => ({ rules }),
    template: `
      <div style="background:var(--tg-bg,#fafaf7); width:390px;
        font-family:'Onest',system-ui,sans-serif; border-radius:20px; overflow:hidden;
        border:1px solid var(--tg-line,#e7e6e1); padding:20px; display:flex;
        flex-direction:column; gap:16px;">

        <div style="font-size:20px; font-weight:700; color:var(--tg-ink,#15171b);">Accrual Rules</div>

        <div v-for="r in rules" :key="r.name"
          style="background:var(--tg-surface,#fff); border:1px solid var(--tg-line,#e7e6e1);
            border-radius:14px; padding:16px; display:flex; flex-direction:column; gap:8px;">
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <div style="font-size:15px; font-weight:600; color:var(--tg-ink,#15171b);">{{ r.name }}</div>
            <div style="display:flex; align-items:center; gap:6px;">
              <div :style="{
                width:'8px', height:'8px', borderRadius:'50%',
                background: r.status === 'active' ? 'var(--tg-success,#1f9d57)' : 'var(--tg-faint,#9a9da3)'
              }"></div>
              <span style="font-size:12px; color:var(--tg-muted,#6a6e76);">{{ r.status }}</span>
            </div>
          </div>
          <div style="font-size:12px; color:var(--tg-muted,#6a6e76);">Limit: {{ r.limit }}</div>
          <div style="display:flex; gap:8px; margin-top:4px;">
            <button :style="{ background: r.status === 'active' ? 'var(--tg-surface-sub,#f3f2ec)' : 'var(--tg-accent,#2d7df6)',
              color: r.status === 'active' ? 'var(--tg-muted,#6a6e76)' : '#fff' }"
              style="flex:1; border:none; border-radius:10px; padding:9px;
                font-family:'Onest',system-ui,sans-serif; font-size:13px; font-weight:600; cursor:pointer;">
              {{ r.status === 'active' ? 'Deactivate' : 'Activate' }}
            </button>
          </div>
        </div>

        <button style="background:transparent; color:var(--tg-accent,#2d7df6);
          border:1px dashed var(--tg-accent,#2d7df6); border-radius:12px; padding:13px; width:100%;
          font-family:'Onest',system-ui,sans-serif; font-size:15px; font-weight:600; cursor:pointer;">
          + New rule
        </button>
      </div>
    `,
  }),
};
