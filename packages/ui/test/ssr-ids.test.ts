import { describe, expect, it } from 'vitest';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import MAccordion from '../src/components/MAccordion.vue';
import MField from '../src/components/MField.vue';
import MInput from '../src/components/MInput.vue';
import MTabs from '../src/components/MTabs.vue';
import MTooltip from '../src/components/MTooltip.vue';

// Every component that mints an id. The instance uid they used to use is a
// process-wide counter, so the server and the client numbered differently and
// hydration saw a different id on every aria-* reference.
const Page = {
  render: () =>
    h('div', [
      h(MTabs, {
        tabs: [
          { label: 'One', value: 'one' },
          { label: 'Two', value: 'two' },
        ],
      }),
      h(MField, { label: 'Name', hint: 'Shown on the card' }, () => h(MInput)),
      h(MTooltip, { text: 'Copy' }, { default: () => h('button', 'Copy') }),
      h(MAccordion, { items: [{ id: 'a', title: 'A', body: 'a' }] }),
    ]),
};

// Every id and id reference in the DOM, in document order.
const idAttrs = (root: Element) =>
  [
    ...root.querySelectorAll(
      '[id], [for], [aria-controls], [aria-labelledby], [aria-describedby], details[name]',
    ),
  ].map((el) =>
    ['id', 'for', 'aria-controls', 'aria-labelledby', 'aria-describedby', 'name']
      .map((a) => `${a}=${el.getAttribute(a) ?? ''}`)
      .join(' '),
  );

describe('SSR ids', () => {
  it('render the same on every server render', async () => {
    // Each request gets a fresh app; ids must not depend on what rendered before.
    const first = await renderToString(createSSRApp(Page));
    const second = await renderToString(createSSRApp(Page));
    expect(second).toBe(first);
  });

  it('hydrate without a mismatch', async () => {
    // Warm the counter the way a long-lived server process would.
    await renderToString(createSSRApp(Page));
    const html = await renderToString(createSSRApp(Page));

    const container = document.createElement('div');
    container.innerHTML = html;
    const serverIds = idAttrs(container);
    const warnings: string[] = [];
    const app = createSSRApp(Page);
    app.config.warnHandler = (msg) => warnings.push(msg);
    const errors: unknown[] = [];
    const original = console.error;
    console.error = (...args: unknown[]) => errors.push(args);
    try {
      app.mount(container);
    } finally {
      console.error = original;
    }

    const mismatches = [...warnings, ...errors.map(String)].filter((m) => /hydration/i.test(m));
    expect(mismatches).toEqual([]);
    // The client kept the server's ids, and they are real (non-empty).
    expect(idAttrs(container)).toEqual(serverIds);
    expect(serverIds.length).toBeGreaterThan(4);
  });
});
