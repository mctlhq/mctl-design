import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MAccordion } from '@mctlhq/ui';

const meta: Meta<typeof MAccordion> = {
  title: 'Components/MAccordion',
  component: MAccordion,
  tags: ['autodocs'],
  argTypes: {
    multiple: { control: 'boolean' },
  },
  args: { multiple: false },
  render: (args) => ({
    components: { MAccordion },
    setup() {
      const items = [
        { id: 'rbac', title: 'How is team isolation enforced?', body: 'Each team gets its own namespace, RBAC, network policies and resource quotas.' },
        { id: 'deploy', title: 'How do deployments work?', body: 'Push to your repo and GitOps reconciles the change — no manual kubectl.' },
        { id: 'secrets', title: 'Where are secrets stored?', body: 'In Vault, with automatic TLS via cert-manager and GitHub SSO.' },
      ];
      return { args, items };
    },
    template: '<MAccordion v-bind="args" :items="items" style="max-width:560px" />',
  }),
};

export default meta;
type Story = StoryObj<typeof MAccordion>;

export const SingleOpen: Story = {};
export const Multiple: Story = { args: { multiple: true } };
