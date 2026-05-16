import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MFooter } from '@mctlhq/ui';

const meta: Meta<typeof MFooter> = {
  title: 'Components/MFooter',
  component: MFooter,
  tags: ['autodocs'],
  argTypes: {
    copyright: { control: 'text' },
  },
  args: {
    links: [
      { label: 'Docs', href: 'https://docs.mctl.ai' },
      { label: 'Security', href: '/security' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'GitHub', href: 'https://github.com/mctlhq' },
    ],
    copyright: '© 2025 MCTL HQ',
  },
  render: (args) => ({
    components: { MFooter },
    setup: () => ({ args }),
    template: '<MFooter v-bind="args" />',
  }),
};

export default meta;
type Story = StoryObj<typeof MFooter>;

export const Default: Story = {};
export const LinksOnly: Story = { args: { copyright: '' } };
export const Minimal: Story = { args: { links: [], copyright: '© 2025 MCTL HQ' } };
