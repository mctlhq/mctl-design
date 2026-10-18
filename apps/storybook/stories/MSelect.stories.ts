import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { MSelect } from '@mctlhq/ui';

const meta: Meta<typeof MSelect> = {
  title: 'Components/MSelect',
  component: MSelect,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  args: { disabled: false, invalid: false, placeholder: '' },
  render: (args) => ({
    components: { MSelect },
    setup() {
      const value = ref('postgres');
      const options = [
        { label: 'PostgreSQL', value: 'postgres' },
        { label: 'MySQL', value: 'mysql' },
        { label: 'Redis', value: 'redis' },
        { label: 'MongoDB', value: 'mongo' },
      ];
      return { args, value, options };
    },
    template:
      '<MSelect v-bind="args" v-model="value" :options="options" aria-label="Database" style="max-width:320px" />',
  }),
};

export default meta;
type Story = StoryObj<typeof MSelect>;

export const Default: Story = {};
export const Invalid: Story = { args: { invalid: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Placeholder: Story = {
  args: { placeholder: 'Choose a database' },
  render: (args) => ({
    components: { MSelect },
    setup() {
      const value = ref('');
      const options = ['PostgreSQL', 'MySQL', 'Redis'];
      return { args, value, options };
    },
    template:
      '<MSelect v-bind="args" v-model="value" :options="options" aria-label="Database" style="max-width:320px" />',
  }),
};
