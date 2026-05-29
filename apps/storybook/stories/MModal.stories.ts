import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { MModal, MButton } from '@mctlhq/ui';

const meta: Meta<typeof MModal> = {
  title: 'Components/MModal',
  component: MModal,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    dismissible: { control: 'boolean' },
  },
  args: { title: 'Team created', dismissible: true },
  render: (args) => ({
    components: { MModal, MButton },
    setup() {
      const open = ref(false);
      return { args, open };
    },
    template: `
      <div>
        <MButton @click="open = true">Open modal</MButton>
        <MModal v-bind="args" v-model:open="open">
          <p>Your Kubernetes namespace is being provisioned — this takes about two minutes.</p>
          <template #footer>
            <MButton variant="ghost" @click="open = false">Dismiss</MButton>
            <MButton @click="open = false">Got it</MButton>
          </template>
        </MModal>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<typeof MModal>;

export const Default: Story = {};
