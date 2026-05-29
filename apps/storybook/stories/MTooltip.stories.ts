import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MTooltip, MButton } from '@mctlhq/ui';

const meta: Meta<typeof MTooltip> = {
  title: 'Components/MTooltip',
  component: MTooltip,
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
    placement: { control: 'inline-radio', options: ['top', 'bottom'] },
  },
  args: { text: 'Provisions in ~2 minutes', placement: 'top' },
  render: (args) => ({
    components: { MTooltip, MButton },
    setup: () => ({ args }),
    template: `
      <div style="padding:48px; display:flex; justify-content:center;">
        <MTooltip v-bind="args">
          <MButton variant="ghost">Hover or focus me</MButton>
        </MTooltip>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<typeof MTooltip>;

export const Top: Story = {};
export const Bottom: Story = { args: { placement: 'bottom' } };
