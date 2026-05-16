import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MSpecCard, MBadge } from '@mctlhq/ui';

const meta: Meta<typeof MSpecCard> = {
  title: 'Components/MSpecCard',
  component: MSpecCard,
  tags: ['autodocs'],
  argTypes: {
    index: { control: 'text' },
    total: { control: 'text' },
    name: { control: 'text' },
    tag: { control: 'text' },
  },
  args: {
    index: '05',
    total: '06',
    name: 'AI-Native Operations',
    tag: '39 MCP tools · 7 AI clients',
  },
  render: (args) => ({
    components: { MSpecCard, MBadge },
    setup: () => ({ args }),
    template: `
      <div style="max-width: 360px;">
        <MSpecCard v-bind="args">
          Deploy, rollback, preview and monitor through natural language.
          Connect Claude, Cursor or VS Code &mdash; your AI sees the same surface
          your engineers do, with the same audit trail.
          <template #chips>
            <MBadge tone="accent">mcp · 39</MBadge>
            <MBadge>claude · cursor</MBadge>
            <MBadge>audited</MBadge>
          </template>
        </MSpecCard>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<typeof MSpecCard>;

export const Default: Story = {};

export const WithoutChips: Story = {
  args: { index: '02', total: '06', name: 'GitOps Delivery', tag: 'push to deploy' },
  render: (args) => ({
    components: { MSpecCard },
    setup: () => ({ args }),
    template: `
      <div style="max-width: 360px;">
        <MSpecCard v-bind="args">
          Every change flows through Git, ArgoCD reconciles the cluster, and
          code moves to production securely and predictably.
        </MSpecCard>
      </div>
    `,
  }),
};

export const Grid: Story = {
  render: () => ({
    components: { MSpecCard, MBadge },
    template: `
      <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:1px; background:var(--surface-line);">
        <MSpecCard index="01" total="06" name="Production-Ready Platform" tag="infrastructure out of the box">
          Pre-integrated Kubernetes platform with Backstage, ArgoCD, Vault and cert-manager.
        </MSpecCard>
        <MSpecCard index="02" total="06" name="GitOps Delivery" tag="push to deploy">
          Fully automated deployments. No manual kubectl.
        </MSpecCard>
      </div>
    `,
  }),
};
