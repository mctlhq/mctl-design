import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref, computed } from 'vue';
import { MTgTabBar } from '@mctlhq/ui';

const meta: Meta = {
  title: 'Telegram/Patterns/RoleBasedNav',
};

export default meta;
type Story = StoryObj;

const allTabs = [
  { key: 'book',    label: 'Book',    icon: '📒', minRole: 'user' },
  { key: 'create',  label: 'Create',  icon: '➕', minRole: 'user' },
  { key: 'orders',  label: 'Orders',  icon: '📊', minRole: 'user' },
  { key: 'deals',   label: 'Deals',   icon: '🤝', minRole: 'user' },
  { key: 'alerts',  label: 'Alerts',  icon: '🔔', minRole: 'user' },
  { key: 'profile', label: 'Profile', icon: '👤', minRole: 'user' },
  { key: 'admin',   label: 'Admin',   icon: '🛡️', minRole: 'moderator' },
];

const roleRank: Record<string, number> = { user: 0, trusted_user: 1, moderator: 2, admin: 3, super_admin: 4 };

export const RoleSelector: Story = {
  render: () => ({
    components: { MTgTabBar },
    setup() {
      const role = ref('user');
      const active = ref('book');
      const roles = ['user', 'trusted_user', 'moderator', 'admin'];
      const tabs = computed(() =>
        allTabs.filter(t => roleRank[role.value] >= roleRank[t.minRole])
      );
      return { role, active, roles, tabs };
    },
    template: `
      <div style="font-family:'Onest',system-ui,sans-serif; display:flex; flex-direction:column; gap:24px;">
        <div>
          <label style="font-size:13px; color:var(--tg-muted,#6a6e76); margin-bottom:8px; display:block;">
            User role
          </label>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button
              v-for="r in roles" :key="r"
              @click="role = r"
              :style="{
                background: role === r ? 'var(--tg-accent,#2d7df6)' : 'var(--tg-surface-sub,#f3f2ec)',
                color: role === r ? '#fff' : 'var(--tg-ink,#15171b)',
              }"
              style="border:none; border-radius:8px; padding:8px 14px;
                font-family:'Onest',system-ui,sans-serif; font-size:13px; cursor:pointer;">
              {{ r.replace('_', ' ') }}
            </button>
          </div>
        </div>
        <div style="background:var(--tg-bg,#fafaf7); width:390px; padding-bottom:60px;
          border-radius:16px; overflow:hidden; border:1px solid var(--tg-line,#e7e6e1);">
          <div style="padding:16px 20px; font-size:17px; font-weight:600; color:var(--tg-ink,#15171b);">
            {{ active.charAt(0).toUpperCase() + active.slice(1) }}
          </div>
          <MTgTabBar :tabs="tabs" v-model="active" :safe-area="false" />
        </div>
        <p style="font-size:13px; color:var(--tg-muted,#6a6e76); margin:0;">
          Admin tab appears only for <strong>moderator</strong> role and above.
          Computed from server-provided role string — no client-side logic.
        </p>
      </div>
    `,
  }),
};
