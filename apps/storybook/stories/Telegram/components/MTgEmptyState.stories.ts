import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MTgEmptyState } from '@mctlhq/ui';

const meta: Meta<typeof MTgEmptyState> = {
  title: 'Telegram/Components/MTgEmptyState',
  component: MTgEmptyState,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['empty', 'loading', 'error'] },
    title: { control: 'text' },
    description: { control: 'text' },
  },
  args: { variant: 'empty', title: 'Nothing here yet', description: 'Your orders will appear here.' },
};

export default meta;
type Story = StoryObj<typeof MTgEmptyState>;

export const Empty: Story = {};

export const Loading: Story = {
  args: { variant: 'loading', title: 'Loading…', description: 'Fetching your data.' },
};

export const Error: Story = {
  args: { variant: 'error', title: 'Something went wrong', description: 'Pull to refresh or try again later.' },
};

export const WithAction: Story = {
  render: () => ({
    components: { MTgEmptyState },
    template: `
      <div style="background:var(--tg-bg,#fafaf7); border-radius:16px; width:390px;">
        <MTgEmptyState
          variant="empty"
          title="No active orders"
          description="Post your first exchange request and connect with other traders."
        >
          <button style="background:var(--tg-accent,#2d7df6); color:#fff; border:none;
            border-radius:12px; padding:12px 24px; font-family:'Onest',system-ui,sans-serif;
            font-size:15px; font-weight:600; cursor:pointer;">
            Create order
          </button>
        </MTgEmptyState>
      </div>
    `,
  }),
};
