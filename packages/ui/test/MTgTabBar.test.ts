import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import MTgTabBar from '../src/components/MTgTabBar.vue';
import { expectNoAxeViolations } from './axe';

const tabs = [
  { key: 'home', label: 'Home' },
  { key: 'orders', label: 'Orders' },
];

describe('MTgTabBar', () => {
  it('is a navigation landmark, not a tablist', () => {
    const wrapper = mount(MTgTabBar, { props: { tabs } });
    expect(wrapper.element.tagName).toBe('NAV');
    expect(wrapper.find('[role="tablist"]').exists()).toBe(false);
    expect(wrapper.find('[role="tab"]').exists()).toBe(false);
  });

  it('switches on click without a v-model binding and marks the current tab', async () => {
    const wrapper = mount(MTgTabBar, { props: { tabs, modelValue: 'home' } });
    const buttons = wrapper.findAll('button');
    expect(buttons[0].attributes('aria-current')).toBe('page');

    const uncontrolled = mount(MTgTabBar, { props: { tabs } });
    await uncontrolled.findAll('button')[1].trigger('click');
    expect(uncontrolled.findAll('button')[1].attributes('aria-current')).toBe('page');
    expect(uncontrolled.emitted('update:modelValue')?.[0]).toEqual(['orders']);
  });

  it('has no axe violations', async () => {
    const wrapper = mount(MTgTabBar, {
      props: { tabs, modelValue: 'home' },
      attachTo: document.body,
    });
    await expectNoAxeViolations(wrapper.element);
    wrapper.unmount();
  });
});
