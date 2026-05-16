import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MAlert } from '@mctlhq/ui';

const meta: Meta<typeof MAlert> = {
  title: 'Components/MAlert',
  component: MAlert,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'select', options: ['info', 'warn', 'bad'] },
  },
  args: { tone: 'info' },
  render: (args) => ({
    components: { MAlert },
    setup: () => ({ args }),
    template: '<MAlert v-bind="args">Streamable HTTP transport is enabled. Each session maintains an open SSE connection.</MAlert>',
  }),
};

export default meta;
type Story = StoryObj<typeof MAlert>;

export const Info: Story = {};
export const Warn: Story = { args: { tone: 'warn' } };
export const Bad: Story = { args: { tone: 'bad' } };

export const AllTones: Story = {
  render: () => ({
    components: { MAlert },
    template: `
      <div style="display:flex; flex-direction:column; gap:12px; max-width:600px;">
        <MAlert tone="info">
          <strong>Note:</strong> Authentication uses OAuth 2.0 PKCE. No client secrets are stored.
        </MAlert>
        <MAlert tone="warn">
          <strong>Warning:</strong> This service holds a server-side Telegram session on your behalf.
        </MAlert>
        <MAlert tone="bad">
          <strong>Error:</strong> Connection failed — the MCP endpoint returned 401 Unauthorized.
        </MAlert>
      </div>
    `,
  }),
};
