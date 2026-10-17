import { afterEach, describe, expect, it } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { h } from 'vue';
import MModal from '../src/components/MModal.vue';
import MTgSheet from '../src/components/MTgSheet.vue';
import { expectNoAxeViolations } from './axe';

afterEach(() => {
  document.body.innerHTML = '';
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
});

const key = (k: string, shiftKey = false) =>
  document.dispatchEvent(new KeyboardEvent('keydown', { key: k, shiftKey, bubbles: true }));
const dialog = () => document.querySelector<HTMLElement>('[role="dialog"]')!;

function modalWithButtons(props: Record<string, unknown> = {}) {
  return mount(MModal, {
    props: { open: true, title: 'Settings', ...props },
    slots: { default: () => [h('button', 'First'), h('button', 'Last')] },
    attachTo: document.body,
  });
}

describe('MModal dialog behaviour', () => {
  it('keeps Tab inside the dialog in both directions', async () => {
    const wrapper = modalWithButtons({ dismissible: false });
    await flushPromises();
    const buttons = Array.from(dialog().querySelectorAll('button'));
    const [first, last] = [buttons[0], buttons[buttons.length - 1]];

    last.focus();
    key('Tab');
    expect(document.activeElement).toBe(first);

    first.focus();
    key('Tab', true);
    expect(document.activeElement).toBe(last);
    wrapper.unmount();
  });

  it('makes the rest of the page inert while open and restores it on close', async () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const wrapper = modalWithButtons();
    await flushPromises();
    expect(app.hasAttribute('inert')).toBe(true);

    await wrapper.setProps({ open: false });
    expect(app.hasAttribute('inert')).toBe(false);
    wrapper.unmount();
  });

  it('names the dialog by its title, or by ariaLabel without one', async () => {
    const titled = modalWithButtons();
    await flushPromises();
    const id = dialog().getAttribute('aria-labelledby');
    expect(id && document.getElementById(id)?.textContent).toBe('Settings');
    await expectNoAxeViolations(dialog());
    titled.unmount();

    const untitled = mount(MModal, {
      props: { open: true, ariaLabel: 'Confirm delete' },
      attachTo: document.body,
    });
    await flushPromises();
    expect(dialog().getAttribute('aria-label')).toBe('Confirm delete');
    expect(dialog().hasAttribute('aria-labelledby')).toBe(false);
    untitled.unmount();
  });

  it('closes on a backdrop press, not on a drag that ends on the backdrop', async () => {
    const wrapper = modalWithButtons();
    await flushPromises();
    const backdrop = document.querySelector<HTMLElement>('.m-modal')!;

    // Text selection: press inside the dialog, release over the backdrop.
    // The click lands on the common ancestor, the backdrop.
    dialog().dispatchEvent(new Event('pointerdown', { bubbles: true }));
    backdrop.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(wrapper.emitted('update:open')).toBeUndefined();

    // The other direction: press on the backdrop, release inside the dialog.
    backdrop.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    dialog().dispatchEvent(new Event('pointerup', { bubbles: true }));
    backdrop.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(wrapper.emitted('update:open')).toBeUndefined();

    backdrop.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    backdrop.dispatchEvent(new Event('pointerup', { bubbles: true }));
    backdrop.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false]);
    wrapper.unmount();
  });

  it('has a generic accessible name when given neither title nor ariaLabel', async () => {
    const wrapper = mount(MModal, { props: { open: true }, attachTo: document.body });
    await flushPromises();
    expect(dialog().getAttribute('aria-label')).toBe('Dialog');
    wrapper.unmount();
  });

  it('pads the body by the scrollbar width on top of its own padding, and restores it', async () => {
    Object.defineProperty(document.documentElement, 'clientWidth', {
      configurable: true,
      value: window.innerWidth - 15,
    });
    document.body.style.paddingRight = '4px';
    try {
      const wrapper = modalWithButtons();
      await flushPromises();
      expect(document.body.style.paddingRight).toBe('19px');
      await wrapper.setProps({ open: false });
      expect(document.body.style.paddingRight).toBe('4px');
      wrapper.unmount();
    } finally {
      Reflect.deleteProperty(document.documentElement, 'clientWidth');
    }
  });
});

describe('MTgSheet dialog behaviour', () => {
  it('moves focus in, closes on Escape and returns focus', async () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    const wrapper = mount(MTgSheet, {
      props: { modelValue: false, title: 'Confirm action' },
      attachTo: document.body,
    });
    await wrapper.setProps({ modelValue: true });
    await flushPromises();
    expect(document.activeElement).toBe(dialog());
    expect(document.body.style.overflow).toBe('hidden');

    key('Escape');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);

    await wrapper.setProps({ modelValue: false });
    expect(document.activeElement).toBe(trigger);
    expect(document.body.style.overflow).toBe('');
    wrapper.unmount();
  });

  it('is named by its title and passes axe', async () => {
    const wrapper = mount(MTgSheet, {
      props: { modelValue: true, title: 'Confirm action' },
      slots: { default: () => h('p', 'Body') },
      attachTo: document.body,
    });
    await flushPromises();
    const id = dialog().getAttribute('aria-labelledby');
    expect(id && document.getElementById(id)?.textContent).toBe('Confirm action');
    await expectNoAxeViolations(dialog());
    wrapper.unmount();
  });
});

describe('stacked dialogs', () => {
  it('hands focus targets to every dialog above when the bottom one closes', async () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    const a = modalWithButtons({ title: 'A' });
    await flushPromises();
    dialog().querySelector('button')!.focus();
    // B and C open in the same tick, so both remember A's button.
    const b = mount(MTgSheet, { props: { modelValue: true, title: 'B' }, attachTo: document.body });
    const c = mount(MModal, { props: { open: true, title: 'C' }, attachTo: document.body });
    await flushPromises();

    await a.setProps({ open: false });
    await b.setProps({ modelValue: false });
    await c.setProps({ open: false });
    expect(document.activeElement).toBe(trigger);
    c.unmount();
    b.unmount();
    a.unmount();
  });

  it('keeps the page inert and focus in the sheet when the modal under it closes first', async () => {
    const app = document.createElement('div');
    const trigger = document.createElement('button');
    app.appendChild(trigger);
    document.body.appendChild(app);
    trigger.focus();

    const modal = modalWithButtons();
    await flushPromises();
    const sheet = mount(MTgSheet, {
      props: { modelValue: true, title: 'Over the modal' },
      attachTo: document.body,
    });
    await flushPromises();
    const sheetEl = document.querySelector<HTMLElement>('.m-tg-sheet')!;
    expect(document.activeElement).toBe(sheetEl);

    await modal.setProps({ open: false });
    expect(app.hasAttribute('inert')).toBe(true);
    expect(document.activeElement).toBe(sheetEl);
    expect(document.body.style.overflow).toBe('hidden');

    // The sheet's own focus target lived in the closed modal; it inherits the
    // modal's, the button that opened the whole stack.
    await sheet.setProps({ modelValue: false });
    expect(app.hasAttribute('inert')).toBe(false);
    expect(document.activeElement).toBe(trigger);
    expect(document.body.style.overflow).toBe('');
    sheet.unmount();
    modal.unmount();
  });

  it('paints a dialog opened over another above it, whatever their CSS z-index', async () => {
    const style = document.createElement('style');
    style.textContent = '.m-modal { z-index: 900; } .m-tg-sheet-root { z-index: 400; }';
    document.head.appendChild(style);
    try {
      const modal = modalWithButtons();
      await flushPromises();
      const sheet = mount(MTgSheet, {
        props: { modelValue: true, title: 'Over the modal' },
        attachTo: document.body,
      });
      await flushPromises();
      const root = document.querySelector<HTMLElement>('.m-tg-sheet-root')!;
      expect(getComputedStyle(root).zIndex).toBe('901');
      sheet.unmount();
      modal.unmount();
    } finally {
      style.remove();
    }
  });

  it('lets only the topmost of a modal and a sheet handle Escape, and keeps scroll locked until both close', async () => {
    const modal = modalWithButtons();
    await flushPromises();
    const sheet = mount(MTgSheet, {
      props: { modelValue: true, title: 'Over the modal' },
      attachTo: document.body,
    });
    await flushPromises();

    key('Escape');
    expect(sheet.emitted('update:modelValue')?.[0]).toEqual([false]);
    expect(modal.emitted('update:open')).toBeUndefined();

    await sheet.setProps({ modelValue: false });
    expect(document.body.style.overflow).toBe('hidden');

    key('Escape');
    expect(modal.emitted('update:open')?.[0]).toEqual([false]);
    await modal.setProps({ open: false });
    expect(document.body.style.overflow).toBe('');
    sheet.unmount();
    modal.unmount();
  });
});
