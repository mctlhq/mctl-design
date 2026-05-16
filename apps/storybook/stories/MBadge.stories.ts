import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MBadge } from '@mctlhq/ui';

const meta: Meta<typeof MBadge> = {
  title: 'Components/MBadge',
  component: MBadge,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'accent', 'ok', 'warn', 'bad'] },
    dot: { control: 'boolean' },
  },
  args: { tone: 'neutral', dot: false },
  render: (args) => ({
    components: { MBadge },
    setup: () => ({ args }),
    template: '<MBadge v-bind="args">mcp · 39</MBadge>',
  }),
};

export default meta;
type Story = StoryObj<typeof MBadge>;

export const Neutral: Story = {};
export const Accent: Story = { args: { tone: 'accent' } };
export const Ok: Story = { args: { tone: 'ok', dot: true } };
export const Warn: Story = { args: { tone: 'warn', dot: true } };
export const Bad: Story = { args: { tone: 'bad', dot: true } };

export const Row: Story = {
  render: () => ({
    components: { MBadge },
    template: `
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <MBadge tone="ok" dot>operational</MBadge>
        <MBadge tone="warn" dot>degraded</MBadge>
        <MBadge tone="bad" dot>incident</MBadge>
        <MBadge tone="accent">day-one prod</MBadge>
        <MBadge>argocd</MBadge>
      </div>
    `,
  }),
};
