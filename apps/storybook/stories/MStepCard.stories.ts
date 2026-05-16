import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MStepCard } from '@mctlhq/ui';

const meta: Meta<typeof MStepCard> = {
  title: 'Components/MStepCard',
  component: MStepCard,
  tags: ['autodocs'],
  argTypes: {
    step: { control: 'text' },
    title: { control: 'text' },
    code: { control: 'text' },
  },
  args: {
    step: '01',
    title: 'Get your workspace.',
    code: 'Sign in → Create team → Get namespace',
  },
  render: (args) => ({
    components: { MStepCard },
    setup: () => ({ args }),
    template: `
      <div style="max-width: 420px;">
        <MStepCard v-bind="args">
          Sign in with GitHub, choose a team name. Your isolated namespace,
          RBAC, secrets and quotas are provisioned in about two minutes.
        </MStepCard>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<typeof MStepCard>;

export const Default: Story = {};

export const WithoutCode: Story = {
  args: { step: '03', title: 'Push your code, or ask AI.', code: '' },
  render: (args) => ({
    components: { MStepCard },
    setup: () => ({ args }),
    template: `
      <div style="max-width: 420px;">
        <MStepCard v-bind="args">
          Push and GitOps deploys it. Or talk to Claude, Cursor or VS Code
          through MCP. Every action is auditable.
        </MStepCard>
      </div>
    `,
  }),
};

export const Sequence: Story = {
  render: () => ({
    components: { MStepCard },
    template: `
      <div style="max-width: 420px;">
        <MStepCard step="01" title="Get your workspace." code="Sign in → Create team → Get namespace">
          Your isolated namespace is provisioned in about two minutes.
        </MStepCard>
        <MStepCard step="02" title="Configure your service." code="Choose template → Configure → Generate">
          Pick a template from the Service Catalog.
        </MStepCard>
        <MStepCard step="03" title="Push your code, or ask AI." code="git push → Build → Deploy → Live ✓">
          Push and GitOps deploys it.
        </MStepCard>
      </div>
    `,
  }),
};
