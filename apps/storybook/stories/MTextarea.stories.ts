import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { MTextarea } from '@mctlhq/ui';

const meta: Meta<typeof MTextarea> = {
  title: 'Components/MTextarea',
  component: MTextarea,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    rows: { control: 'number' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
  args: { placeholder: "Tell us what you'd like to deploy", rows: 4, disabled: false, invalid: false },
  render: (args) => ({
    components: { MTextarea },
    setup() {
      const value = ref('');
      return { args, value };
    },
    template: '<MTextarea v-bind="args" v-model="value" style="max-width:420px" />',
  }),
};

export default meta;
type Story = StoryObj<typeof MTextarea>;

export const Default: Story = {};
export const Invalid: Story = { args: { invalid: true } };
export const Disabled: Story = { args: { disabled: true } };
