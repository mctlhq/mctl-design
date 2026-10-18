import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import MField from '../src/components/MField.vue';
import MInput from '../src/components/MInput.vue';
import MTextarea from '../src/components/MTextarea.vue';
import MSelect from '../src/components/MSelect.vue';
import { expectNoAxeViolations } from './axe';

// MField renders the label and message; the control lives in its slot and is
// wired by the consumer, the way the docs show it.
function field(control: typeof MInput | typeof MTextarea | typeof MSelect, props = {}) {
  return mount(MField, {
    props: { label: 'Namespace', for: 'ns', hint: 'Lowercase letters only', ...props },
    slots: {
      default: ({ describedBy }: { describedBy?: string }) =>
        h(control as never, {
          id: 'ns',
          'aria-describedby': describedBy,
          ...(control === MSelect ? { options: ['dev', 'prod'] } : {}),
        }),
    },
    attachTo: document.body,
  });
}

describe('MInput and MTextarea', () => {
  it.each([
    ['MInput', MInput, 'input'],
    ['MTextarea', MTextarea, 'textarea'],
  ] as const)('%s emits update:modelValue on input', async (_name, component, tag) => {
    const wrapper = mount(component as typeof MInput, { props: { modelValue: 'a' } });
    const el = wrapper.find(tag);
    expect((el.element as HTMLInputElement).value).toBe('a');
    await el.setValue('ab');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['ab']);
  });

  it('marks an invalid control with aria-invalid and leaves a valid one without it', () => {
    expect(
      mount(MInput, { props: { invalid: true } })
        .find('input')
        .attributes('aria-invalid'),
    ).toBe('true');
    expect(mount(MInput).find('input').attributes('aria-invalid')).toBeUndefined();
  });
});

describe('MSelect', () => {
  it('normalises string options and emits the chosen value', async () => {
    const wrapper = mount(MSelect, {
      props: { modelValue: 'dev', options: ['dev', { label: 'Production', value: 'prod' }] },
    });
    const options = wrapper.findAll('option');
    expect(options.map((o) => [o.text(), o.attributes('value')])).toEqual([
      ['dev', 'dev'],
      ['Production', 'prod'],
    ]);
    await wrapper.find('select').setValue('prod');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['prod']);
  });

  it('forwards attributes to the native select and keeps class on the wrapper', () => {
    const wrapper = mount(MSelect, {
      props: { options: ['a'] },
      attrs: { class: 'wide', 'aria-describedby': 'msg', name: 'env' },
    });
    expect(wrapper.classes()).toContain('wide');
    const select = wrapper.find('select');
    expect(select.attributes('aria-describedby')).toBe('msg');
    expect(select.attributes('name')).toBe('env');
    expect(select.classes()).not.toContain('wide');
  });
});

describe('MField', () => {
  it('labels the control and describes it with the hint', () => {
    const wrapper = field(MInput);
    const input = wrapper.find('input');
    expect(wrapper.find('label').attributes('for')).toBe('ns');
    const describedBy = input.attributes('aria-describedby');
    expect(describedBy && document.getElementById(describedBy)?.textContent).toBe(
      'Lowercase letters only',
    );
    wrapper.unmount();
  });

  it('replaces the hint with an announced error', () => {
    const wrapper = field(MInput, { error: 'Already taken' });
    const message = wrapper.find('[role="alert"]');
    expect(message.text()).toBe('Already taken');
    expect(wrapper.find('input').attributes('aria-describedby')).toBe(message.attributes('id'));
    expect(wrapper.text()).not.toContain('Lowercase letters only');
    wrapper.unmount();
  });

  it('describes nothing when there is no message', () => {
    const wrapper = field(MInput, { hint: '' });
    expect(wrapper.find('input').attributes('aria-describedby')).toBeUndefined();
    wrapper.unmount();
  });

  it.each([
    ['MInput', MInput],
    ['MTextarea', MTextarea],
    ['MSelect', MSelect],
  ] as const)('passes axe wrapping %s, with hint and with error', async (_name, control) => {
    for (const props of [{}, { error: 'Already taken', required: true }]) {
      const wrapper = field(control, props);
      await expectNoAxeViolations(wrapper.element);
      wrapper.unmount();
    }
  });
});

describe('MField auto-wiring', () => {
  it.each([
    ['MInput', MInput, 'input'],
    ['MTextarea', MTextarea, 'textarea'],
    ['MSelect', MSelect, 'select'],
  ] as const)(
    'labels and describes %s with no wiring by the consumer',
    async (_n, control, tag) => {
      const wrapper = mount(MField, {
        props: { label: 'Namespace', hint: 'Lowercase letters only', required: true },
        slots: {
          default: () => h(control as never, control === MSelect ? { options: ['dev'] } : {}),
        },
        attachTo: document.body,
      });
      const el = wrapper.find(tag);
      expect(wrapper.find('label').attributes('for')).toBe(el.attributes('id'));
      const describedBy = el.attributes('aria-describedby');
      expect(describedBy && document.getElementById(describedBy)?.textContent).toBe(
        'Lowercase letters only',
      );
      expect(el.attributes('aria-required')).toBe('true');
      await expectNoAxeViolations(wrapper.element);

      await wrapper.setProps({ error: 'Already taken' });
      expect(el.attributes('aria-invalid')).toBe('true');
      expect(el.attributes('aria-describedby')).toBe(
        wrapper.find('[role="alert"]').attributes('id'),
      );
      wrapper.unmount();
    },
  );

  it('points the label at an id set on the control itself', async () => {
    const wrapper = mount(MField, {
      props: { label: 'Username' },
      slots: { default: () => h(MInput, { id: 'username' }) },
    });
    // The control registers during the field's render; the label follows.
    await nextTick();
    expect(wrapper.find('input').attributes('id')).toBe('username');
    expect(wrapper.find('label').attributes('for')).toBe('username');
  });

  it.each([
    ['MInput', MInput, 'input'],
    ['MTextarea', MTextarea, 'textarea'],
    ['MSelect', MSelect, 'select'],
  ] as const)('keeps an explicit id and aria-describedby on %s', (_n, control, tag) => {
    const wrapper = mount(MField, {
      props: { label: 'Namespace', for: 'ns', hint: 'Hint' },
      slots: {
        default: () =>
          h(control as never, {
            id: 'ns',
            'aria-describedby': 'custom',
            ...(control === MSelect ? { options: ['dev'] } : {}),
          }),
      },
    });
    const el = wrapper.find(tag);
    expect(el.attributes('id')).toBe('ns');
    expect(el.attributes('aria-describedby')).toBe('custom');
  });
});

describe('MSelect placeholder', () => {
  it('shows a disabled empty option while nothing is chosen', async () => {
    const wrapper = mount(MSelect, {
      props: { options: ['dev', 'prod'], placeholder: 'Choose an environment' },
    });
    const first = wrapper.find('option');
    expect(first.text()).toBe('Choose an environment');
    expect(first.attributes('value')).toBe('');
    expect(first.attributes('disabled')).toBeDefined();
    expect((wrapper.find('select').element as HTMLSelectElement).value).toBe('');
    await wrapper.find('select').setValue('prod');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['prod']);
  });
});

describe('fields without a v-model', () => {
  // defineModel keeps the value locally when nothing is bound. A plain
  // `:value` bound to an unchanging prop let any re-render write the stale
  // prop back over what the user typed or picked.
  it.each([
    ['MInput', MInput, 'input'],
    ['MTextarea', MTextarea, 'textarea'],
  ] as const)('%s keeps typed text across a re-render', async (_name, component, tag) => {
    const wrapper = mount(component as typeof MInput);
    const el = wrapper.find(tag);
    await el.setValue('typed');
    await wrapper.setProps({ placeholder: 'Changed' });
    expect((el.element as HTMLInputElement).value).toBe('typed');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['typed']);
  });

  it('MSelect keeps its choice when the options change', async () => {
    const wrapper = mount(MSelect, { props: { options: ['a', 'b'], placeholder: 'Pick' } });
    const select = wrapper.find('select');
    await select.setValue('b');
    await wrapper.setProps({ options: ['a', 'b', 'c'] });
    expect((select.element as HTMLSelectElement).value).toBe('b');
  });
});
