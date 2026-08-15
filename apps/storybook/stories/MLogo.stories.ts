import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MLogo } from '@mctlhq/ui';

const meta: Meta<typeof MLogo> = {
  title: 'Brand/MLogo',
  component: MLogo,
  tags: ['autodocs'],
  argTypes: {
    size: { control: { type: 'number', min: 24, max: 320, step: 8 } },
    glow: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: { size: 180, glow: true, label: 'MCTL' },
  render: (args) => ({
    components: { MLogo },
    setup: () => ({ args }),
    template: '<MLogo v-bind="args" />',
  }),
};

export default meta;
type Story = StoryObj<typeof MLogo>;

export const Default: Story = {};

export const Glow: Story = {
  args: { glow: true, size: 220 },
};

export const Sizes: Story = {
  render: () => ({
    components: { MLogo },
    template: `
      <div style="display:flex; align-items:flex-end; gap:32px; flex-wrap:wrap;">
        <MLogo :size="48" label="" />
        <MLogo :size="96" label="" />
        <MLogo :size="160" glow label="" />
      </div>
    `,
  }),
};
