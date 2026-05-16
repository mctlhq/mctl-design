import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MTable, MCard, MPill, MBadge } from '@mctlhq/ui';

const meta: Meta = {
  title: 'Patterns/DataDisplay',
};

export default meta;
type Story = StoryObj;

export const ToolsTable: Story = {
  render: () => ({
    components: { MTable, MPill },
    template: `
      <MCard style="max-width:700px;">
        <template #header>Available MCP tools</template>
        <MTable>
          <thead><tr>
            <th>Tool</th>
            <th>Annotation</th>
            <th>Scope</th>
          </tr></thead>
          <tbody>
            <tr v-for="tool in tools" :key="tool.name">
              <td><code>{{ tool.name }}</code></td>
              <td><MPill :tone="tool.type === 'read' ? 'accent' : 'warn'">{{ tool.type }}</MPill></td>
              <td><code>{{ tool.scope }}</code></td>
            </tr>
          </tbody>
        </MTable>
      </MCard>
    `,
    setup: () => ({
      tools: [
        { name: 'list_dialogs', type: 'read', scope: 'telegram:dialogs:read' },
        { name: 'get_messages', type: 'read', scope: 'telegram:messages:read' },
        { name: 'send_message', type: 'write', scope: 'telegram:messages:send' },
        { name: 'pin_message', type: 'write', scope: 'telegram:messages:pin' },
      ],
    }),
  }),
};

export const ServiceCards: Story = {
  render: () => ({
    components: { MCard, MBadge },
    template: `
      <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:12px; max-width:840px;">
        <MCard v-for="svc in services" :key="svc.name">
          <template #header>
            <span style="display:flex; align-items:center; justify-content:space-between;">
              {{ svc.name }}
              <MBadge :tone="svc.tone" dot>{{ svc.status }}</MBadge>
            </span>
          </template>
          {{ svc.desc }}
          <template #footer>{{ svc.url }}</template>
        </MCard>
      </div>
    `,
    setup: () => ({
      services: [
        { name: 'mctl-api', tone: 'ok', status: 'operational', desc: 'REST API + MCP server', url: 'api.mctl.ai' },
        { name: 'mctl-agent', tone: 'ok', status: 'operational', desc: 'Self-healing agent', url: 'agent.mctl.ai' },
        { name: 'mctl-docs', tone: 'warn', status: 'degraded', desc: 'VitePress docs portal', url: 'docs.mctl.ai' },
      ],
    }),
  }),
};
