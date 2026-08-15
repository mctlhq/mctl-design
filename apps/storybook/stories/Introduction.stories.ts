import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MLogo } from '@mctlhq/ui';

const meta: Meta = {
  title: 'Introduction',
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  name: 'Overview',
  render: () => ({
    components: { MLogo },
    template: `
      <div class="mctl-prose" style="max-width: 720px;">
        <MLogo :size="96" glow />
        <h1>MCTL Design System</h1>
        <p class="mctl-lede">
          Swiss-engineering minimalism &times; editorial density.
        </p>
        <p>
          The shared visual language for <code>mctl.ai</code>,
          <code>docs.mctl.ai</code>, <code>tg.mctl.ai</code> and future
          MCTL web surfaces. Default accent is terracotta on cool ink and
          warm paper; UI type is Onest, editorial voice is Instrument Serif,
          code is JetBrains Mono.
        </p>
        <h2>Packages</h2>
        <ul>
          <li><code>@mctlhq/tokens</code> &mdash; design tokens; framework-agnostic.</li>
          <li><code>@mctlhq/css</code> &mdash; theme variables, global &amp; prose styles, Tailwind preset; framework-agnostic.</li>
          <li><code>@mctlhq/ui</code> &mdash; Vue 3 component library.</li>
        </ul>
        <h2>Theming</h2>
        <p>
          Use the <strong>light/dark toggle</strong> in the toolbar to flip the
          whole Storybook UI &mdash; chrome and story canvas together &mdash;
          between the dark <em>Engineering</em> and light <em>Editorial</em>
          surfaces. The <strong>Accent</strong> control cycles terracotta,
          cyan, lime and lilac on the canvas. They map to the
          <code>data-theme</code> and <code>data-accent</code> attributes.
          <code>vermilion</code> remains a public alias of terracotta.
        </p>
        <h2>Brand</h2>
        <p>
          The hex mark is <code>MLogo</code> under <strong>Brand</strong>.
          It paints with <code>currentColor</code> / <code>var(--accent)</code>,
          so the Storybook Accent control (and consumer Tweaks) recolor it.
          Use the standalone SVG at <code>/mctl-hex.svg</code> only when inlined
          or masked &mdash; an <code>&lt;img&gt;</code> cannot inherit tokens.
        </p>
        <h2>Sections</h2>
        <ul>
          <li><strong>Foundations</strong> &mdash; colors, typography, spacing, surfaces, product scale.</li>
          <li><strong>Brand</strong> &mdash; the token-aware hex logo.</li>
          <li><strong>Components</strong> &mdash; the Vue 3 component library.</li>
        </ul>
      </div>
    `,
  }),
};
