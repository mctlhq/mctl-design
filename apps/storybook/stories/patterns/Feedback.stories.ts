import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MAlert, MCard } from '@mctlhq/ui';

const meta: Meta = {
  title: 'Patterns/Feedback',
};

export default meta;
type Story = StoryObj;

export const AlertStack: Story = {
  render: () => ({
    components: { MAlert },
    template: `
      <div style="display:flex; flex-direction:column; gap:10px; max-width:580px;">
        <MAlert tone="info">
          <strong>Info:</strong> The MCP endpoint supports Streamable HTTP (SSE).
          Add it as a custom connector in Claude.ai.
        </MAlert>
        <MAlert tone="warn">
          <strong>Warning:</strong> This service stores an encrypted MTProto session.
          Review the <a href="/security" style="color:var(--accent)">security model</a> before connecting.
        </MAlert>
        <MAlert tone="bad">
          <strong>Error:</strong> Connection failed — the OAuth authorization server returned 502.
          Check <code>api.mctl.ai</code> health.
        </MAlert>
      </div>
    `,
  }),
};

export const AlertInCard: Story = {
  render: () => ({
    components: { MAlert, MCard },
    template: `
      <MCard style="max-width:500px;">
        <template #header>Connect Telegram</template>
        <div style="display:flex; flex-direction:column; gap:12px;">
          <MAlert tone="warn">
            You are about to grant this server access to your Telegram account.
            Read the <a href="/privacy" style="color:var(--accent)">privacy policy</a> first.
          </MAlert>
          <p style="font-family:var(--font-mono); font-size:14px; color:var(--surface-fg-muted); margin:0;">
            Click the Telegram login widget below to authenticate.
          </p>
        </div>
      </MCard>
    `,
  }),
};
