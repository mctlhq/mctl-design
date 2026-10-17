import { afterEach, describe, expect, it } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { h } from 'vue';
import MModal from '../src/components/MModal.vue';
import MTooltip from '../src/components/MTooltip.vue';

afterEach(() => {
  document.body.innerHTML = '';
  document.body.style.overflow = '';
});

const escape = (target: EventTarget) =>
  target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

function tooltip() {
  return mount(MTooltip, {
    props: { text: 'Copies the command' },
    slots: {
      default: ({ tipId }: { tipId: string }) => h('button', { 'aria-describedby': tipId }, 'Copy'),
    },
    attachTo: document.body,
  });
}

describe('MTooltip (WCAG 1.4.13)', () => {
  it('Escape dismisses it without moving focus, until focus leaves', async () => {
    const wrapper = tooltip();
    const button = wrapper.find('button');
    button.element.focus();
    await button.trigger('focusin');

    escape(button.element);
    await flushPromises();
    expect(wrapper.classes()).toContain('m-tooltip--dismissed');
    expect(document.activeElement).toBe(button.element);

    await button.trigger('focusout', { relatedTarget: null });
    expect(wrapper.classes()).not.toContain('m-tooltip--dismissed');
    wrapper.unmount();
  });

  it('Escape dismisses it while hovered, and it comes back on the next hover', async () => {
    const wrapper = tooltip();
    await wrapper.trigger('pointerenter');
    escape(document.body);
    await flushPromises();
    expect(wrapper.classes()).toContain('m-tooltip--dismissed');

    await wrapper.trigger('pointerleave');
    await wrapper.trigger('pointerenter');
    expect(wrapper.classes()).not.toContain('m-tooltip--dismissed');
    wrapper.unmount();
  });

  it('ignores Escape when neither hovered nor focused', async () => {
    const wrapper = tooltip();
    escape(document.body);
    await flushPromises();
    expect(wrapper.classes()).not.toContain('m-tooltip--dismissed');
    wrapper.unmount();
  });

  it('takes the first Escape inside a modal, so only the second closes the modal', async () => {
    const modal = mount(MModal, {
      props: { open: true, title: 'Run' },
      slots: {
        default: () =>
          h(MTooltip, { text: 'Copies the command' }, () => h('button', { id: 'copy' }, 'Copy')),
      },
      attachTo: document.body,
    });
    await flushPromises();
    const button = document.getElementById('copy')!;
    button.focus();
    button.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await flushPromises();

    escape(button);
    expect(modal.emitted('update:open')).toBeUndefined();
    escape(button);
    expect(modal.emitted('update:open')?.[0]).toEqual([false]);
    modal.unmount();
  });
});
