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
    size: { control: 'select', options: ['sm', 'md'] },
  },
  args: { disabled: false, invalid: false, placeholder: '', size: 'md' },
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

// 0.21.0: the 32px control height, for toolbars and the site header.
export const Small: Story = {
  args: { size: 'sm' },
  play: async ({ canvasElement }) => {
    const h = canvasElement.querySelector('select')!.getBoundingClientRect().height;
    if (Math.round(h) !== 32) throw new Error(`sm select is ${h}px tall, expected 32px`);
  },
};

// 0.21.0: an option can be listed but not chosen.
export const DisabledOption: Story = {
  render: (args) => ({
    components: { MSelect },
    setup() {
      const value = ref('k8s');
      const options = [
        { label: 'Kubernetes basics', value: 'k8s' },
        { label: 'GitOps with ArgoCD', value: 'gitops' },
        { label: 'Terraform (coming soon)', value: 'tf', disabled: true },
      ];
      return { args, value, options };
    },
    template:
      '<MSelect v-bind="args" v-model="value" :options="options" aria-label="Course" style="max-width:320px" />',
  }),
  play: async ({ canvasElement }) => {
    const opts = canvasElement.querySelectorAll('option');
    if (!opts[2].disabled) throw new Error('the third option is not disabled');
    if (opts[0].disabled || opts[1].disabled) throw new Error('an enabled option is disabled');
  },
};
