import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MNav } from '@mctlhq/ui';

const items = [
  { label: 'Overview', href: '#', active: true },
  { label: 'Services', href: '#' },
  { label: 'Workflows', href: '#' },
  { label: 'Incidents', href: '#' },
  { label: 'Settings', href: '#' },
];

const meta: Meta<typeof MNav> = {
  title: 'Components/MNav',
  component: MNav,
  tags: ['autodocs'],
  args: { items },
  render: (args) => ({
    components: { MNav },
    setup: () => ({ args }),
    template: '<MNav v-bind="args" />',
  }),
};

export default meta;
type Story = StoryObj<typeof MNav>;

export const Default: Story = {};

export const NoActiveItem: Story = {
  args: {
    items: items.map((i) => ({ ...i, active: false })),
  },
};
