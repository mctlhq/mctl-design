import { afterEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import MModal from '../src/components/MModal.vue';

afterEach(() => {
  document.body.innerHTML = '';
  document.body.style.overflow = '';
});

describe('MModal', () => {
  it('closes on Escape and restores body scroll and focus', async () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    const wrapper = mount(MModal, { props: { open: false, title: 'Hello' }, attachTo: document.body });
    await wrapper.setProps({ open: true });
    await nextTick();
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.activeElement?.getAttribute('role')).toBe('dialog');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false]);

    await wrapper.setProps({ open: false });
    expect(document.body.style.overflow).toBe('');
    expect(document.activeElement).toBe(trigger);
    wrapper.unmount();
  });

  it('ignores Escape when not dismissible', async () => {
    const wrapper = mount(MModal, { props: { open: true, dismissible: false }, attachTo: document.body });
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(wrapper.emitted('update:open')).toBeUndefined();
    wrapper.unmount();
  });

  it('lets only the topmost of stacked modals handle Escape', async () => {
    const outer = mount(MModal, { props: { open: true, title: 'Outer' }, attachTo: document.body });
    const inner = mount(MModal, { props: { open: true, title: 'Inner' }, attachTo: document.body });
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(inner.emitted('update:open')?.[0]).toEqual([false]);
    expect(outer.emitted('update:open')).toBeUndefined();
    inner.unmount();
    outer.unmount();
  });
});
