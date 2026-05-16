import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta = {
  title: 'Introduction',
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  name: 'Overview',
  render: () => ({
    template: `
      <div class="mctl-prose" style="max-width: 720px;">
        <h1>MCTL Design System</h1>
        <p>
          <em>Swiss-engineering minimalism &times; editorial density.</em>
          The shared visual language for <code>mctl.ai</code>,
          <code>docs.mctl.ai</code> and future MCTL web surfaces.
        </p>
        <h2>Packages</h2>
        <ul>
          <li><code>@mctlhq/tokens</code> &mdash; design tokens; framework-agnostic.</li>
          <li><code>@mctlhq/css</code> &mdash; theme variables, global &amp; prose styles, Tailwind preset; framework-agnostic.</li>
          <li><code>@mctlhq/ui</code> &mdash; Vue 3 component library.</li>
        </ul>
        <h2>Theming</h2>
        <p>
          Use the <strong>Theme</strong> and <strong>Accent</strong> toolbar
          controls above to flip between the dark <em>Engineering</em> and light
          <em>Editorial</em> surfaces and the four accents. They map to the
          <code>data-theme</code> and <code>data-accent</code> attributes.
        </p>
        <h2>Sections</h2>
        <ul>
          <li><strong>Foundations</strong> &mdash; colors, typography, spacing, surfaces.</li>
          <li><strong>Components</strong> &mdash; the Vue 3 component library.</li>
        </ul>
      </div>
    `,
  }),
};
