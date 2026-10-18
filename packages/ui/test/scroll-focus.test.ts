import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import MCodeBlock from '../src/components/MCodeBlock.vue';
import MTable from '../src/components/MTable.vue';
import MYamlBlock from '../src/components/MYamlBlock.vue';

// jsdom has no layout and no ResizeObserver: stub the observer so the test
// can resize, and give the container whatever overflow the case needs.
let notify: () => void = () => {};
class FakeResizeObserver {
  constructor(cb: () => void) {
    notify = cb;
  }
  observe() {}
  disconnect() {}
}

function size(el: Element, scrollWidth: number, clientWidth: number) {
  Object.defineProperty(el, 'scrollWidth', { configurable: true, value: scrollWidth });
  Object.defineProperty(el, 'clientWidth', { configurable: true, value: clientWidth });
}

afterEach(() => vi.unstubAllGlobals());

describe('scroll containers', () => {
  it.each([
    ['MTable', () => mount(MTable, { attachTo: document.body }), '.m-table-wrap'],
    [
      'MCodeBlock',
      () => mount(MCodeBlock, { props: { code: 'x' }, attachTo: document.body }),
      'pre',
    ],
    [
      'MYamlBlock',
      () => mount(MYamlBlock, { props: { code: 'a: 1' }, attachTo: document.body }),
      'pre',
    ],
  ] as const)('%s is a tab stop only while its content overflows', async (_n, make, selector) => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    const wrapper = make();
    const el = wrapper.find(selector);
    // Measured on mount: jsdom reports 0 by 0, so it fits.
    await nextTick();
    expect(el.attributes('tabindex')).toBeUndefined();

    size(el.element, 600, 200);
    notify();
    await nextTick();
    expect(el.attributes('tabindex')).toBe('0');

    size(el.element, 200, 200);
    notify();
    await nextTick();
    expect(el.attributes('tabindex')).toBeUndefined();
    wrapper.unmount();
  });

  it.each([
    ['MCodeBlock', MCodeBlock],
    ['MYamlBlock', MYamlBlock],
  ] as const)('%s re-measures when its code changes', async (_n, component) => {
    // The inner <code> is inline, so a wider line resizes nothing the observer
    // sees: only the re-render can notice it.
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    const wrapper = mount(component as typeof MCodeBlock, {
      props: { code: 'a: 1' },
      attachTo: document.body,
    });
    const pre = wrapper.find('pre');
    await nextTick();
    expect(pre.attributes('tabindex')).toBeUndefined();

    size(pre.element, 900, 200);
    await wrapper.setProps({ code: 'a: a much longer line than the block can hold' });
    await nextTick();
    expect(pre.attributes('tabindex')).toBe('0');
    wrapper.unmount();
  });

  it('stays a tab stop without ResizeObserver, re-renders included', async () => {
    // jsdom has none: nothing could ever restore the stop once dropped.
    const wrapper = mount(MCodeBlock, { props: { code: 'x' }, attachTo: document.body });
    const pre = wrapper.find('pre');
    await nextTick();
    expect(pre.attributes('tabindex')).toBe('0');
    await wrapper.setProps({ code: 'y' });
    await nextTick();
    expect(pre.attributes('tabindex')).toBe('0');
    wrapper.unmount();
  });
});
