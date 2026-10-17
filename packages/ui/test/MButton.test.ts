import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import MButton from '../src/components/MButton.vue';
import { expectNoAxeViolations } from './axe';

describe('MButton', () => {
  it('defaults to type="button" so it does not submit a surrounding form', async () => {
    const onSubmit = vi.fn((e: Event) => e.preventDefault());
    const Form = defineComponent(
      () => () => h('form', { onSubmit }, [h(MButton, null, () => 'Go')]),
    );
    const wrapper = mount(Form, { attachTo: document.body });
    expect(wrapper.find('button').attributes('type')).toBe('button');
    await wrapper.find('button').trigger('click');
    expect(onSubmit).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it('accepts an explicit submit type', () => {
    const wrapper = mount(MButton, { props: { type: 'submit' } });
    expect(wrapper.attributes('type')).toBe('submit');
  });

  it('uses the native disabled attribute on a button', () => {
    const wrapper = mount(MButton, { props: { disabled: true } });
    expect(wrapper.attributes('disabled')).toBeDefined();
  });

  it('takes a disabled link out of navigation and the tab order', async () => {
    const onClick = vi.fn();
    const wrapper = mount(MButton, {
      props: { as: 'a', disabled: true },
      attrs: { href: '/next', onClick },
    });
    expect(wrapper.element.tagName).toBe('A');
    expect(wrapper.attributes('href')).toBeUndefined();
    expect(wrapper.attributes('tabindex')).toBe('-1');
    expect(wrapper.attributes('aria-disabled')).toBe('true');
    await wrapper.trigger('click');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('keeps href and listeners on an enabled link, without a type attribute', () => {
    const wrapper = mount(MButton, { props: { as: 'a' }, attrs: { href: '/next' } });
    expect(wrapper.attributes('href')).toBe('/next');
    expect(wrapper.attributes('type')).toBeUndefined();
  });

  it('renders a component passed as `as`, and a plain <a> for it when disabled', () => {
    const Link = defineComponent({
      props: { to: { type: String, required: true } },
      setup:
        (props, { slots }) =>
        () =>
          h('a', { href: props.to, 'data-link': '' }, slots.default?.()),
    });
    const enabled = mount(MButton, { props: { as: Link }, attrs: { to: '/x' } });
    expect(enabled.find('[data-link]').attributes('href')).toBe('/x');

    const disabled = mount(MButton, { props: { as: Link, disabled: true }, attrs: { to: '/x' } });
    expect(disabled.find('[data-link]').exists()).toBe(false);
    expect(disabled.element.tagName).toBe('A');
    expect(disabled.attributes('href')).toBeUndefined();
  });

  it('falls back to <a> for a disabled component passed by name', () => {
    const wrapper = mount(MButton, {
      props: { as: 'RouterLink', disabled: true },
      attrs: { to: '/x' },
    });
    expect(wrapper.element.tagName).toBe('A');
    expect(wrapper.attributes('to')).toBeUndefined();
  });

  it('drops every listener on a disabled link, not only onClick', async () => {
    const onClickCapture = vi.fn();
    const onKeydown = vi.fn();
    const wrapper = mount(MButton, {
      props: { as: 'a', disabled: true },
      attrs: { href: '/next', onClickCapture, onKeydown },
    });
    await wrapper.trigger('click');
    await wrapper.trigger('keydown', { key: 'Enter' });
    expect(onClickCapture).not.toHaveBeenCalled();
    expect(onKeydown).not.toHaveBeenCalled();
  });

  it('keeps consumer classes alongside its own', () => {
    const wrapper = mount(MButton, { attrs: { class: 'extra' } });
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['m-button', 'extra']));
  });

  it('has no axe violations', async () => {
    const wrapper = mount(MButton, { slots: { default: 'Save' }, attachTo: document.body });
    await expectNoAxeViolations(wrapper.element);
    wrapper.unmount();
  });
});
