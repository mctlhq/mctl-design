import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MTooltip, MButton } from '@mctlhq/ui';

const meta: Meta<typeof MTooltip> = {
  title: 'Components/MTooltip',
  component: MTooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Shown on hover or when the slotted control has focus (WCAG 1.4.13): Escape hides it without moving focus, the pointer can move onto the bubble, and long text wraps. Pass `tipId` to the control as `aria-describedby`.',
      },
    },
  },
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
          <template #default="{ tipId }">
            <MButton variant="ghost" :aria-describedby="tipId">Hover or focus me</MButton>
          </template>
        </MTooltip>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<typeof MTooltip>;

export const Top: Story = {};
export const Bottom: Story = { args: { placement: 'bottom' } };
export const LongText: Story = {
  args: {
    text: 'Provisions a namespace, a database and an ingress in about two minutes; the first deploy starts as soon as the image is pushed.',
  },
};
