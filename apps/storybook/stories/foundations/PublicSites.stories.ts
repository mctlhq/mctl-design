import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta = { title: 'Foundations/Public Sites' };
export default meta;
type Story = StoryObj;

export const ShellAndReading: Story = {
  render: () => ({
    template: `
      <div style="display:grid;gap:32px">
        <section v-for="theme in ['dark', 'light']" :key="theme" :data-theme="theme"
          style="background:var(--surface-bg);color:var(--surface-fg);font-family:var(--font-display);border:1px solid var(--surface-line)">
          <header style="height:var(--site-header-height);background:var(--site-header-bg);border-bottom:1px solid var(--site-header-border);display:flex;align-items:center;justify-content:space-between;gap:24px;padding:0 var(--site-gutter)">
            <span style="display:flex;align-items:center;line-height:1;font-size:var(--site-wordmark-size);font-weight:var(--site-wordmark-weight);letter-spacing:var(--site-wordmark-tracking)"><span style="color:var(--accent);margin-right:var(--site-wordmark-accent-gap)">M</span>CTL</span>
            <span style="font-size:var(--site-nav-size);font-weight:var(--site-nav-weight);color:var(--surface-fg-muted)">Platform · Docs</span>
          </header>
          <article style="max-width:var(--mctl-layout-prose-width);padding:32px 20px;margin:auto;font-size:var(--text-prose-size);line-height:var(--text-prose-leading)">
            <h1 style="font-size:var(--text-prose-title-size);line-height:var(--text-prose-title-leading);font-weight:var(--text-prose-title-weight)">Deploy your first service</h1>
            <p>Readable documentation uses a steady 16px body with generous leading. Marketing headings use a separate fluid role; both share the same family and semantic colors.</p>
            <h2 style="font-size:var(--text-prose-section-size);font-weight:var(--text-prose-section-weight)">Service configuration</h2>
            <label style="display:grid;gap:8px;font-size:var(--text-label-size)">Service name
              <input aria-label="Service name" value="my-service" style="font:inherit;background:var(--control-bg);color:var(--surface-fg);border:1px solid var(--control-border);padding:12px" />
            </label>
            <input aria-label="Disabled service field" disabled value="Managed by the platform" style="margin-top:12px;font:inherit;background:var(--control-disabled-bg);color:var(--surface-fg-muted);border:1px solid var(--control-border);padding:12px" />
            <p style="background:var(--status-ok-soft);color:var(--status-ok-text);padding:12px">Deployment completed</p>
            <p style="background:var(--status-bad-soft);color:var(--status-bad-text);padding:12px">Check the repository and tag</p>
            <pre style="overflow:auto;background:var(--surface-card);border:1px solid var(--surface-line);padding:16px;font-family:var(--font-mono);font-size:var(--text-code-size)">mctl_get_service_status</pre>
          </article>
        </section>
      </div>
    `,
  }),
};
