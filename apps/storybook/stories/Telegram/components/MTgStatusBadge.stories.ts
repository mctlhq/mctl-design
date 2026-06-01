import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MTgStatusBadge } from '@mctlhq/ui';

const meta: Meta<typeof MTgStatusBadge> = {
  title: 'Telegram/Components/MTgStatusBadge',
  component: MTgStatusBadge,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['active', 'reserved', 'accepted', 'pending', 'completed', 'cancelled', 'rejected', 'expired'],
    },
  },
  args: { status: 'active' },
};

export default meta;
type Story = StoryObj<typeof MTgStatusBadge>;

export const Active: Story = {};
export const Reserved: Story = { args: { status: 'reserved' } };
export const Accepted: Story = { args: { status: 'accepted' } };
export const Pending: Story = { args: { status: 'pending' } };
export const Completed: Story = { args: { status: 'completed' } };
export const Cancelled: Story = { args: { status: 'cancelled' } };
export const Rejected: Story = { args: { status: 'rejected' } };
export const Expired: Story = { args: { status: 'expired' } };

export const AllStatuses: Story = {
  render: () => ({
    components: { MTgStatusBadge },
    template: `
      <div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center; font-family:'Onest',system-ui,sans-serif;">
        <MTgStatusBadge status="active" />
        <MTgStatusBadge status="reserved" />
        <MTgStatusBadge status="accepted" />
        <MTgStatusBadge status="pending" />
        <MTgStatusBadge status="completed" />
        <MTgStatusBadge status="cancelled" />
        <MTgStatusBadge status="rejected" />
        <MTgStatusBadge status="expired" />
      </div>
    `,
  }),
};
