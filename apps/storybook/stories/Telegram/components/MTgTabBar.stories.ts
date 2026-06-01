import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { MTgTabBar } from '@mctlhq/ui';

const meta: Meta<typeof MTgTabBar> = {
  title: 'Telegram/Components/MTgTabBar',
  component: MTgTabBar,
  tags: ['autodocs'],
  argTypes: {
    safeArea: { control: 'boolean' },
  },
  args: { safeArea: false },
};

export default meta;
type Story = StoryObj<typeof MTgTabBar>;

const customerTabs = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'qr', label: 'My QR', icon: '▣' },
  { key: 'rewards', label: 'Rewards', icon: '🎁' },
  { key: 'profile', label: 'Profile', icon: '👤' },
];

const adminTabs = [
  { key: 'scan', label: 'Scan', icon: '⬛' },
  { key: 'requests', label: 'Requests', icon: '📋' },
  { key: 'staff', label: 'Staff', icon: '👥' },
  { key: 'rules', label: 'Rules', icon: '⚙️' },
];

export const Customer: Story = {
  render: () => ({
    components: { MTgTabBar },
    setup() {
      const active = ref('home');
      return { active, tabs: customerTabs };
    },
    template: `
      <div style="background:var(--tg-bg,#fafaf7); width:390px; padding-bottom:60px; border-radius:16px; overflow:hidden;">
        <div style="padding:20px; font-family:'Onest',system-ui,sans-serif;
          font-size:20px; font-weight:700; color:var(--tg-ink,#15171b);">
          {{ active.charAt(0).toUpperCase() + active.slice(1) }}
        </div>
        <MTgTabBar :tabs="tabs" v-model="active" :safe-area="false" />
      </div>
    `,
  }),
};

export const Admin: Story = {
  render: () => ({
    components: { MTgTabBar },
    setup() {
      const active = ref('scan');
      return { active, tabs: adminTabs };
    },
    template: `
      <div style="background:var(--tg-bg,#fafaf7); width:390px; padding-bottom:60px; border-radius:16px; overflow:hidden;">
        <div style="padding:20px; font-family:'Onest',system-ui,sans-serif;
          font-size:20px; font-weight:700; color:var(--tg-ink,#15171b);">
          {{ active.charAt(0).toUpperCase() + active.slice(1) }}
        </div>
        <MTgTabBar :tabs="tabs" v-model="active" :safe-area="false" />
      </div>
    `,
  }),
};

export const PairDesk: Story = {
  name: 'PairDesk (7 tabs)',
  render: () => ({
    components: { MTgTabBar },
    setup() {
      const active = ref('book');
      const tabs = [
        { key: 'book', label: 'Book', icon: '📒' },
        { key: 'create', label: 'Create', icon: '➕' },
        { key: 'orders', label: 'Orders', icon: '📊' },
        { key: 'deals', label: 'Deals', icon: '🤝' },
        { key: 'alerts', label: 'Alerts', icon: '🔔' },
        { key: 'profile', label: 'Profile', icon: '👤' },
        { key: 'admin', label: 'Admin', icon: '🛡️' },
      ];
      return { active, tabs };
    },
    template: `
      <div style="background:var(--tg-bg,#fafaf7); width:390px; padding-bottom:60px; border-radius:16px; overflow:hidden;">
        <div style="padding:20px; font-family:'Onest',system-ui,sans-serif;
          font-size:20px; font-weight:700; color:var(--tg-ink,#15171b);">
          {{ active.charAt(0).toUpperCase() + active.slice(1) }}
        </div>
        <MTgTabBar :tabs="tabs" v-model="active" :safe-area="false" />
      </div>
    `,
  }),
};
