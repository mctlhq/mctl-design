import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MPill } from '@mctlhq/ui';

const meta: Meta<typeof MPill> = {
  title: 'Components/MPill',
  component: MPill,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'accent', 'ok', 'warn', 'bad'] },
    variant: { control: 'select', options: ['filled', 'outline'] },
  },
  args: { tone: 'accent', variant: 'filled' },
  render: (args) => ({
    components: { MPill },
    setup: () => ({ args }),
    template: '<MPill v-bind="args">read</MPill>',
  }),
};

export default meta;
type Story = StoryObj<typeof MPill>;

export const Filled: Story = {};
export const Outline: Story = { args: { variant: 'outline' } };

export const ScopePills: Story = {
  render: () => ({
    components: { MPill },
    template: `
      <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
        <MPill tone="accent">read</MPill>
        <MPill tone="warn">write</MPill>
        <MPill tone="bad">admin</MPill>
        <MPill tone="ok">verified</MPill>
        <MPill tone="neutral">internal</MPill>
      </div>
    `,
  }),
};

export const OutlinePills: Story = {
  render: () => ({
    components: { MPill },
    template: `
      <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
        <MPill tone="accent" variant="outline">read</MPill>
        <MPill tone="warn" variant="outline">write</MPill>
        <MPill tone="bad" variant="outline">admin</MPill>
        <MPill tone="ok" variant="outline">verified</MPill>
        <MPill tone="neutral" variant="outline">internal</MPill>
      </div>
    `,
  }),
};
