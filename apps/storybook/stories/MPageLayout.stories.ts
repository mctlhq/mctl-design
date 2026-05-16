import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MPageLayout } from '@mctlhq/ui';

const meta: Meta<typeof MPageLayout> = {
  title: 'Components/MPageLayout',
  component: MPageLayout,
  tags: ['autodocs'],
  argTypes: {
    maxWidth: { control: 'select', options: ['sm', 'md', 'lg', 'full'] },
  },
  args: { maxWidth: 'md' },
  render: (args) => ({
    components: { MPageLayout },
    setup: () => ({ args }),
    template: `
      <MPageLayout v-bind="args">
        <div style="background:var(--surface-card); border:1px solid var(--surface-line);
          border-radius:6px; padding:24px; font-family:var(--font-mono); color:var(--surface-fg-muted);">
          Page content constrained to <strong>{{ args.maxWidth }}</strong> max-width.
        </div>
      </MPageLayout>
    `,
  }),
};

export default meta;
type Story = StoryObj<typeof MPageLayout>;

export const Medium: Story = {};
export const Small: Story = { args: { maxWidth: 'sm' } };
export const Large: Story = { args: { maxWidth: 'lg' } };
export const Full: Story = { args: { maxWidth: 'full' } };
