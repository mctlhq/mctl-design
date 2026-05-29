import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { MInput } from '@mctlhq/ui';

const meta: Meta<typeof MInput> = {
  title: 'Components/MInput',
  component: MInput,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
  args: { placeholder: 'my-team', disabled: false, invalid: false },
  render: (args) => ({
    components: { MInput },
    setup() {
      const value = ref('');
      return { args, value };
    },
    template: '<MInput v-bind="args" v-model="value" style="max-width:320px" />',
  }),
};

export default meta;
type Story = StoryObj<typeof MInput>;

export const Default: Story = {};
export const Invalid: Story = { args: { invalid: true, placeholder: 'taken-name' } };
export const Disabled: Story = { args: { disabled: true, placeholder: 'locked' } };
