import { describe, expect, it } from 'vitest';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import MAccordion from '../src/components/MAccordion.vue';
import MField from '../src/components/MField.vue';
import MInput from '../src/components/MInput.vue';
import MModal from '../src/components/MModal.vue';
import MTabs from '../src/components/MTabs.vue';
import MTgSheet from '../src/components/MTgSheet.vue';
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
      // A second tabs instance: ids must stay unique within one app.
      h(MTabs, { tabs: [{ label: 'Three', value: 'three' }] }),
      // Rendered open, so their title ids reach the (teleported) markup.
      h(MModal, { open: true, title: 'Consent' }),
      h(MTgSheet, { modelValue: true, title: 'Filters' }),
    ]),
};

async function render(prefix?: string) {
  const app = createSSRApp(Page);
  if (prefix) app.config.idPrefix = prefix;
  const ctx: { teleports?: Record<string, string> } = {};
  const html = await renderToString(app, ctx);
  return { html, teleports: ctx.teleports ?? {} };
}

const ids = (markup: string) => [...markup.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);

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
  it('render the same on every server render, teleported dialogs included', async () => {
    // Each request gets a fresh app; ids must not depend on what rendered before.
    const first = await render();
    const second = await render();
    expect(second.html).toBe(first.html);
    expect(second.teleports).toEqual(first.teleports);
    const dialogIds = ids(Object.values(first.teleports).join(''));
    expect(dialogIds.some((id) => id.startsWith('m-modal-title-'))).toBe(true);
    expect(dialogIds.some((id) => id.startsWith('m-tg-sheet-title-'))).toBe(true);
  });

  it('are unique within one app', async () => {
    const { html, teleports } = await render();
    const all = ids(html + Object.values(teleports).join(''));
    expect(new Set(all).size).toBe(all.length);
  });

  it('stay apart across apps on one page when each sets idPrefix', async () => {
    // useId numbers per app: two apps without a prefix would collide.
    const a = await render('a');
    const b = await render('b');
    const shared = ids(a.html).filter((id) => ids(b.html).includes(id));
    expect(shared).toEqual([]);
  });

  it('hydrate without a mismatch', async () => {
    // Warm the counter the way a long-lived server process would.
    await render();
    const { html, teleports } = await render();

    // Lay the page out as an SSR document does: teleported dialogs go into
    // <body> ahead of the app root.
    document.body.innerHTML = `${teleports.body ?? ''}<div id="app">${html}</div>`;
    const container = document.getElementById('app')!;
    const serverIds = idAttrs(document.body);
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
    // The client kept the server's ids, dialog titles included.
    expect(idAttrs(document.body)).toEqual(serverIds);
    expect(serverIds.length).toBeGreaterThan(6);
    app.unmount();
    document.body.innerHTML = '';
  });
});
