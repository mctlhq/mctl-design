import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import MTabs from '../src/components/MTabs.vue';
import { expectNoAxeViolations } from './axe';

const tabs = [
  { label: 'One', value: 'one' },
  { label: 'Two', value: 'two words' },
  { label: 'Three', value: 'three' },
];

function selected(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('[role="tab"][aria-selected="true"]').text();
}

describe('MTabs', () => {
  it('defaults to the first tab', () => {
    const wrapper = mount(MTabs, { props: { tabs } });
    expect(selected(wrapper)).toBe('One');
  });

  it('switches on click without a v-model binding', async () => {
    const wrapper = mount(MTabs, { props: { tabs } });
    await wrapper.findAll('[role="tab"]')[1].trigger('click');
    expect(selected(wrapper)).toBe('Two');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['two words']);
  });

  it('follows the bound value when controlled', async () => {
    const wrapper = mount(MTabs, { props: { tabs, modelValue: 'three' } });
    expect(selected(wrapper)).toBe('Three');
    await wrapper.setProps({ modelValue: 'one' });
    expect(selected(wrapper)).toBe('One');
  });

  it('roves with arrow keys, Home and End, keeping one tab in the tab order', async () => {
    const wrapper = mount(MTabs, { props: { tabs }, attachTo: document.body });
    const tab = () => wrapper.find('[role="tab"][tabindex="0"]');

    await tab().trigger('keydown', { key: 'ArrowLeft' });
    expect(selected(wrapper)).toBe('Three');
    await tab().trigger('keydown', { key: 'ArrowRight' });
    expect(selected(wrapper)).toBe('One');
    await tab().trigger('keydown', { key: 'End' });
    expect(selected(wrapper)).toBe('Three');
    await tab().trigger('keydown', { key: 'Home' });
    await nextTick();
    expect(selected(wrapper)).toBe('One');
    expect(document.activeElement?.textContent?.trim()).toBe('One');
    expect(wrapper.findAll('[tabindex="0"][role="tab"]')).toHaveLength(1);
    wrapper.unmount();
  });

  it('builds valid ids from values with spaces and links the panel to the active tab', async () => {
    const wrapper = mount(MTabs, { props: { tabs, modelValue: 'two words' } });
    const active = wrapper.find('[role="tab"][aria-selected="true"]');
    expect(active.attributes('id')).not.toMatch(/\s/);
    expect(wrapper.find('[role="tabpanel"]').attributes('aria-labelledby')).toBe(
      active.attributes('id'),
    );
  });

  it('has no axe violations', async () => {
    const wrapper = mount(MTabs, { props: { tabs }, attachTo: document.body });
    await expectNoAxeViolations(wrapper.element);
    wrapper.unmount();
  });
});
