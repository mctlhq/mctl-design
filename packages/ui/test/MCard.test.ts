import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import MButton from '../src/components/MButton.vue';
import MCard from '../src/components/MCard.vue';
import MPill from '../src/components/MPill.vue';
import { expectNoAxeViolations } from './axe';

describe('MCard', () => {
  it('keeps the 0.20 defaults: a div, mono, not interactive, no media or actions', () => {
    const wrapper = mount(MCard, { slots: { default: 'Body' } });
    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['m-card', 'm-card--mono']));
    expect(wrapper.classes()).not.toContain('m-card--interactive');
    expect(wrapper.find('.m-card__media').exists()).toBe(false);
    expect(wrapper.find('.m-card__actions').exists()).toBe(false);
  });

  it('renders media first and actions after the body, before the footer', () => {
    const wrapper = mount(MCard, {
      slots: {
        media: () => h('img', { src: 'badge.svg', alt: '' }),
        header: 'Header',
        default: 'Body',
        actions: () => h(MButton, null, () => 'Start'),
        footer: 'Footer',
      },
    });
    const order = Array.from((wrapper.element as HTMLElement).children).map((el) => el.className);
    expect(order).toEqual([
      'm-card__media',
      'm-card__header',
      'm-card__body',
      'm-card__actions',
      'm-card__footer',
    ]);
    expect(wrapper.find('.m-card__media img').exists()).toBe(true);
    expect(wrapper.find('.m-card__actions button').text()).toBe('Start');
  });

  it('renders as another element or a component', () => {
    expect(mount(MCard, { props: { as: 'article' } }).element.tagName).toBe('ARTICLE');

    const link = mount(MCard, { props: { as: 'a', interactive: true }, attrs: { href: '/c/1' } });
    expect(link.element.tagName).toBe('A');
    expect(link.attributes('href')).toBe('/c/1');
    expect(link.classes()).toContain('m-card--interactive');

    const Link = defineComponent({
      props: { to: { type: String, required: true } },
      setup:
        (props, { slots }) =>
        () =>
          h('a', { href: props.to, 'data-link': '' }, slots.default?.()),
    });
    const routed = mount(MCard, { props: { as: Link }, attrs: { to: '/c/2' } });
    expect(routed.find('[data-link]').attributes('href')).toBe('/c/2');
  });

  it('switches the type family with font="sans"', () => {
    const wrapper = mount(MCard, { props: { font: 'sans' } });
    expect(wrapper.classes()).toContain('m-card--sans');
    expect(wrapper.classes()).not.toContain('m-card--mono');
  });

  it('has no axe violations as a course card', async () => {
    const wrapper = mount(MCard, {
      props: { as: 'article', interactive: true, font: 'sans' },
      slots: {
        media: () => h('img', { src: 'badge.svg', alt: '' }),
        default: () => [
          h(MPill, { tone: 'accent' }, () => 'In progress'),
          h('h3', 'Kubernetes basics'),
          h('p', 'Pods, deployments and services, with a tenant of your own.'),
        ],
        actions: () => [
          h(MButton, { variant: 'neutral' }, () => 'Continue'),
          h(MButton, { variant: 'ghost' }, () => 'Syllabus'),
        ],
      },
      attachTo: document.body,
    });
    await expectNoAxeViolations(wrapper.element);
    wrapper.unmount();
  });
});
