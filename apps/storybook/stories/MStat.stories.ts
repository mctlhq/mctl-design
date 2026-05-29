import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MStat } from '@mctlhq/ui';

const meta: Meta<typeof MStat> = {
  title: 'Components/MStat',
  component: MStat,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    label: { control: 'text' },
    caption: { control: 'text' },
    trend: { control: 'inline-radio', options: [undefined, 'up', 'down', 'flat'] },
  },
  args: { value: '99.95%', label: 'Uptime', caption: 'Last 90 days', trend: 'up' },
  render: (args) => ({
    components: { MStat },
    setup: () => ({ args }),
    template: '<MStat v-bind="args" />',
  }),
};

export default meta;
type Story = StoryObj<typeof MStat>;

export const Default: Story = {};

export const Row: Story = {
  render: () => ({
    components: { MStat },
    template: `
      <div style="display:flex; gap:64px; flex-wrap:wrap;">
        <MStat value="2m" label="Time to prod" caption="Sign-in to namespace" />
        <MStat value="39" label="MCP tools" trend="up" />
        <MStat value="0" label="Tickets filed" caption="Self-service" trend="down" />
      </div>
    `,
  }),
};
