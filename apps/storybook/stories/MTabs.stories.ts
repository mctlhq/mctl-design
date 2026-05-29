import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { MTabs } from '@mctlhq/ui';

const meta: Meta<typeof MTabs> = {
  title: 'Components/MTabs',
  component: MTabs,
  tags: ['autodocs'],
  render: () => ({
    components: { MTabs },
    setup() {
      const active = ref('overview');
      const tabs = [
        { label: 'Overview', value: 'overview' },
        { label: 'Config', value: 'config' },
        { label: 'Logs', value: 'logs' },
      ];
      return { active, tabs };
    },
    template: `
      <MTabs v-model="active" :tabs="tabs" style="max-width:560px">
        <template #default="{ active }">
          <p v-if="active === 'overview'">Service overview — status, replicas, and endpoints.</p>
          <p v-else-if="active === 'config'">Configuration — environment, secrets and resource limits.</p>
          <p v-else>Streaming logs from the running workload.</p>
        </template>
      </MTabs>
    `,
  }),
};

export default meta;
type Story = StoryObj<typeof MTabs>;

export const Default: Story = {};
