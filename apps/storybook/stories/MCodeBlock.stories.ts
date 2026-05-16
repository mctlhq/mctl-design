import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MCodeBlock } from '@mctlhq/ui';

const meta: Meta<typeof MCodeBlock> = {
  title: 'Components/MCodeBlock',
  component: MCodeBlock,
  tags: ['autodocs'],
  argTypes: {
    lang: { control: 'text' },
    filename: { control: 'text' },
  },
  args: {
    lang: 'bash',
    filename: '',
    code: `curl -s -X POST https://api.mctl.ai/mcp \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $TOKEN" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'`,
  },
  render: (args) => ({
    components: { MCodeBlock },
    setup: () => ({ args }),
    template: '<MCodeBlock v-bind="args" />',
  }),
};

export default meta;
type Story = StoryObj<typeof MCodeBlock>;

export const Bash: Story = {};

export const WithFilename: Story = {
  args: {
    lang: 'yaml',
    filename: 'values.yaml',
    code: `image:
  repository: ghcr.io/mctlhq/mctl-api
  tag: "1.4.2"
service:
  port: 8080
ingress:
  hosts:
    - api.mctl.ai`,
  },
};

export const JSON: Story = {
  args: {
    lang: 'json',
    filename: '',
    code: `{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      { "name": "mctl_list_services", "description": "List all services" },
      { "name": "mctl_get_service_status", "description": "Get status of a service" }
    ]
  }
}`,
  },
};
