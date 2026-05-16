import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MCard, MBadge } from '@mctlhq/ui';

const meta: Meta<typeof MCard> = {
  title: 'Components/MCard',
  component: MCard,
  tags: ['autodocs'],
  argTypes: {
    elevated: { control: 'boolean' },
  },
  args: { elevated: false },
  render: (args) => ({
    components: { MCard },
    setup: () => ({ args }),
    template: `
      <MCard v-bind="args" style="max-width:360px;">
        <template #header>mctl-api</template>
        REST API and MCP server. Handles auth, tenant management, and incident routing.
      </MCard>
    `,
  }),
};

export default meta;
type Story = StoryObj<typeof MCard>;

export const Default: Story = {};
export const Elevated: Story = { args: { elevated: true } };

export const WithFooter: Story = {
  render: () => ({
    components: { MCard, MBadge },
    template: `
      <MCard style="max-width:360px;">
        <template #header>
          <span style="display:flex; align-items:center; justify-content:space-between;">
            mctl-agent
            <MBadge tone="ok" dot>operational</MBadge>
          </span>
        </template>
        Self-healing agent. Receives AlertManager webhooks, runs diagnostic skills,
        and opens fix PRs in mctl-gitops.
        <template #footer>agent.mctl.ai · Go 1.25</template>
      </MCard>
    `,
  }),
};

export const Grid: Story = {
  render: () => ({
    components: { MCard, MBadge },
    template: `
      <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:12px;">
        <MCard v-for="svc in services" :key="svc.name">
          <template #header>
            <span style="display:flex; align-items:center; justify-content:space-between;">
              {{ svc.name }}
              <MBadge :tone="svc.status === 'ok' ? 'ok' : 'warn'" dot>{{ svc.status }}</MBadge>
            </span>
          </template>
          {{ svc.desc }}
        </MCard>
      </div>
    `,
    setup: () => ({
      services: [
        { name: 'mctl-api', status: 'ok', desc: 'REST API + MCP server' },
        { name: 'mctl-agent', status: 'ok', desc: 'Self-healing agent' },
        { name: 'mctl-portal', status: 'warn', desc: 'Backstage developer portal' },
      ],
    }),
  }),
};
