import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MTable, MPill } from '@mctlhq/ui';

const meta: Meta<typeof MTable> = {
  title: 'Components/MTable',
  component: MTable,
  tags: ['autodocs'],
  render: () => ({
    components: { MTable, MPill },
    template: `
      <MTable>
        <thead>
          <tr>
            <th>Tool</th>
            <th>Annotation</th>
            <th>Scope</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>list_dialogs</code></td>
            <td><MPill tone="accent">read</MPill></td>
            <td><code>telegram:dialogs:read</code></td>
            <td>Returns up to 200 dialogs.</td>
          </tr>
          <tr>
            <td><code>send_message</code></td>
            <td><MPill tone="warn">write</MPill></td>
            <td><code>telegram:messages:send</code></td>
            <td>Default mode is draft (dry-run).</td>
          </tr>
          <tr>
            <td><code>list_identities</code></td>
            <td><MPill tone="bad">admin</MPill></td>
            <td><code>admin:users</code></td>
            <td>Admin only. Returns all signed-in users.</td>
          </tr>
        </tbody>
      </MTable>
    `,
  }),
};

export default meta;
type Story = StoryObj<typeof MTable>;

export const Default: Story = {};
