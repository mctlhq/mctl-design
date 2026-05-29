import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { MField, MInput, MTextarea, MSelect } from '@mctlhq/ui';

const meta: Meta<typeof MField> = {
  title: 'Components/MField',
  component: MField,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Team name',
    hint: 'Lowercase with hyphens — becomes your workspace namespace.',
    error: '',
    required: true,
  },
  render: (args) => ({
    components: { MField, MInput },
    setup() {
      const value = ref('');
      return { args, value };
    },
    template: `
      <MField v-bind="args" for="team" style="max-width:420px">
        <MInput id="team" v-model="value" placeholder="my-team" :invalid="!!args.error" />
      </MField>
    `,
  }),
};

export default meta;
type Story = StoryObj<typeof MField>;

export const WithHint: Story = {};
export const WithError: Story = {
  args: { error: 'That name is already taken.' },
};

export const Form: Story = {
  render: () => ({
    components: { MField, MInput, MTextarea, MSelect },
    setup() {
      const team = ref('');
      const db = ref('postgres');
      const notes = ref('');
      const options = [
        { label: 'PostgreSQL', value: 'postgres' },
        { label: 'MySQL', value: 'mysql' },
        { label: 'Redis', value: 'redis' },
      ];
      return { team, db, notes, options };
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:24px; max-width:420px;">
        <MField label="Team name" for="t" required hint="Becomes your namespace.">
          <MInput id="t" v-model="team" placeholder="my-team" />
        </MField>
        <MField label="Database" for="d">
          <MSelect id="d" v-model="db" :options="options" />
        </MField>
        <MField label="What will you build?" for="n">
          <MTextarea id="n" v-model="notes" placeholder="Tell us about your project" />
        </MField>
      </div>
    `,
  }),
};
