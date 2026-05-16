import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MYamlBlock } from '@mctlhq/ui';

const sample = `apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: checkout-web
  owner: team/checkout
spec:
  type: service
  lifecycle: production
  runtime: node-api  # template
  database: postgres
  domain: checkout.acme.dev
  secrets:
    - ref: vault://kv/team/checkout/db
  previewEnvs:
    enabled: true
    ttl: 7d
  tls: cert-manager`;

const meta: Meta<typeof MYamlBlock> = {
  title: 'Components/MYamlBlock',
  component: MYamlBlock,
  tags: ['autodocs'],
  argTypes: {
    code: { control: 'text' },
    filename: { control: 'text' },
  },
  args: {
    code: sample,
    filename: 'catalog-info.yaml',
  },
  render: (args) => ({
    components: { MYamlBlock },
    setup: () => ({ args }),
    template: '<div style="max-width: 520px;"><MYamlBlock v-bind="args" /></div>',
  }),
};

export default meta;
type Story = StoryObj<typeof MYamlBlock>;

export const Default: Story = {};
export const WithoutFilename: Story = { args: { filename: '' } };

export const Short: Story = {
  args: {
    filename: 'values.yaml',
    code: `image:
  repository: ghcr.io/mctlhq/mctl-design
  tag: "0.1.0"
service:
  port: 80`,
  },
};
