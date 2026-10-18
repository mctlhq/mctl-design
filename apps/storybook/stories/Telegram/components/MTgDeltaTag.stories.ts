import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MTgDeltaTag } from '@mctlhq/ui';

const meta: Meta<typeof MTgDeltaTag> = {
  title: 'Telegram/Components/MTgDeltaTag',
  component: MTgDeltaTag,
  tags: ['autodocs'],
  argTypes: {
    delta: { control: { type: 'number', step: 0.1 } },
    threshold: { control: { type: 'number', step: 0.1 } },
  },
  args: { delta: 2.3, threshold: 0.1 },
};

export default meta;
type Story = StoryObj<typeof MTgDeltaTag>;

export const Positive: Story = { args: { delta: 3.2 } };
export const Negative: Story = { args: { delta: -1.8 } };
export const Neutral: Story = { args: { delta: 0.04 } };

export const Row: Story = {
  render: () => ({
    components: { MTgDeltaTag },
    template: `
      <div style="display:flex; align-items:center; gap:10px; font-family:'Onest',system-ui,sans-serif;">
        <MTgDeltaTag :delta="5.4" />
        <MTgDeltaTag :delta="0.04" />
        <MTgDeltaTag :delta="-2.1" />
        <MTgDeltaTag :delta="12.8" />
        <MTgDeltaTag :delta="-0.5" />
      </div>
    `,
  }),
};
