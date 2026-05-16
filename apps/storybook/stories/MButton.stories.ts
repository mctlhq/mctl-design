import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MButton } from '@mctlhq/ui';

const meta: Meta<typeof MButton> = {
  title: 'Components/MButton',
  component: MButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md'] },
    disabled: { control: 'boolean' },
    as: { control: 'text' },
  },
  args: { variant: 'primary', size: 'md', disabled: false, as: 'button' },
  render: (args) => ({
    components: { MButton },
    setup: () => ({ args }),
    template: '<MButton v-bind="args">Request access &rarr;</MButton>',
  }),
};

export default meta;
type Story = StoryObj<typeof MButton>;

export const Primary: Story = {};
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Small: Story = { args: { size: 'sm' } };
export const Disabled: Story = { args: { disabled: true } };

export const AsLink: Story = {
  args: { as: 'a', variant: 'ghost' },
  render: (args) => ({
    components: { MButton },
    setup: () => ({ args }),
    template: '<MButton v-bind="args" href="https://docs.mctl.ai">Read the docs</MButton>',
  }),
};
