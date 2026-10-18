import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, type Component } from 'vue';
import MAccordion from '../src/components/MAccordion.vue';
import MAlert from '../src/components/MAlert.vue';
import MBadge from '../src/components/MBadge.vue';
import MCard from '../src/components/MCard.vue';
import MCodeBlock from '../src/components/MCodeBlock.vue';
import MFooter from '../src/components/MFooter.vue';
import MLogo from '../src/components/MLogo.vue';
import MNav from '../src/components/MNav.vue';
import MPageLayout from '../src/components/MPageLayout.vue';
import MPill from '../src/components/MPill.vue';
import MSpecCard from '../src/components/MSpecCard.vue';
import MStat from '../src/components/MStat.vue';
import MStepCard from '../src/components/MStepCard.vue';
import MTable from '../src/components/MTable.vue';
import MTgDeltaTag from '../src/components/MTgDeltaTag.vue';
import MTgEmptyState from '../src/components/MTgEmptyState.vue';
import MTgOrderCard from '../src/components/MTgOrderCard.vue';
import MTgSheet from '../src/components/MTgSheet.vue';
import MTgStatusBadge from '../src/components/MTgStatusBadge.vue';
import MTooltip from '../src/components/MTooltip.vue';
import MYamlBlock from '../src/components/MYamlBlock.vue';
import { expectNoAxeViolations } from './axe';

// Every component the other test files do not already run axe against,
// rendered the way its story renders it. jsdom has no layout, so rules that
// need it (colour contrast, scrollable regions) are out of reach here.
const cases: Array<[string, Component, Record<string, unknown>, (() => unknown) | undefined]> = [
  ['MAlert', MAlert, { tone: 'warn' }, () => 'Quota is at 90%.'],
  ['MBadge', MBadge, { tone: 'ok', dot: true }, () => 'Healthy'],
  ['MCard', MCard, { elevated: true }, () => h('p', 'Card body')],
  ['MPill', MPill, { tone: 'accent' }, () => 'Beta'],
  [
    'MStat',
    MStat,
    { value: '99.95%', label: 'Uptime', caption: '30 days', trend: 'up' },
    undefined,
  ],
  [
    'MStepCard',
    MStepCard,
    { step: '01', title: 'Create a tenant', code: 'mctl tenant create' },
    undefined,
  ],
  [
    'MSpecCard',
    MSpecCard,
    { index: '01', total: '04', name: 'Isolation', tag: 'core' },
    () => 'Each tenant gets a namespace.',
  ],
  [
    'MCodeBlock',
    MCodeBlock,
    { code: 'kubectl get pods', lang: 'bash', filename: 'run.sh' },
    undefined,
  ],
  [
    'MYamlBlock',
    MYamlBlock,
    { code: 'kind: Service\nmetadata:\n  name: api', filename: 'svc.yaml' },
    undefined,
  ],
  [
    'MNav',
    MNav,
    {
      items: [
        { label: 'Docs', href: '/docs', active: true },
        { label: 'Pricing', href: '/pricing' },
      ],
    },
    undefined,
  ],
  [
    'MFooter',
    MFooter,
    { links: [{ label: 'GitHub', href: 'https://github.com/mctlhq' }], copyright: '© MCTL' },
    undefined,
  ],
  ['MPageLayout', MPageLayout, { maxWidth: 'md' }, () => h('main', h('h1', 'Title'))],
  ['MLogo', MLogo, { label: 'MCTL' }, undefined],
  ['MTgDeltaTag', MTgDeltaTag, { delta: 1.2 }, undefined],
  ['MTgStatusBadge', MTgStatusBadge, { status: 'pending' }, undefined],
  [
    'MTgEmptyState',
    MTgEmptyState,
    { variant: 'empty', title: 'No orders', description: 'Create one to start.' },
    undefined,
  ],
  [
    'MTgOrderCard',
    MTgOrderCard,
    {
      direction: 'BUY',
      pair: 'USDT/RUB',
      rate: '92.40',
      delta: 0.4,
      methods: ['SBP'],
      volume: '1 000 USDT',
      status: 'pending',
      author: 'alice',
    },
    undefined,
  ],
  [
    'MAccordion',
    MAccordion,
    {
      items: [
        { id: 'a', title: 'What is MCTL?', body: 'A platform.' },
        { id: 'b', title: 'Pricing', body: 'Per tenant.' },
      ],
    },
    undefined,
  ],
];

describe('axe over the remaining components', () => {
  it.each(cases)('%s has no violations', async (_name, component, props, slot) => {
    const wrapper = mount(component, {
      props,
      slots: slot ? { default: slot } : undefined,
      attachTo: document.body,
    });
    await expectNoAxeViolations(wrapper.element);
    wrapper.unmount();
  });

  it('MTable has no violations with a caption, header and body', async () => {
    const wrapper = mount(MTable, {
      slots: {
        default: () => [
          h('caption', 'Services'),
          h('thead', h('tr', [h('th', 'Name'), h('th', 'Status')])),
          h('tbody', h('tr', [h('td', 'api'), h('td', 'Running')])),
        ],
      },
      attachTo: document.body,
    });
    await expectNoAxeViolations(wrapper.element);
    wrapper.unmount();
  });

  it('MTgSheet, open and teleported, has no violations', async () => {
    const wrapper = mount(MTgSheet, {
      props: { open: true, title: 'Filters' },
      slots: { default: () => h('p', 'Sheet body') },
      attachTo: document.body,
    });
    const sheet = document.querySelector<HTMLElement>('[role="dialog"]')!;
    expect(sheet.getAttribute('aria-modal')).toBe('true');
    await expectNoAxeViolations(document.querySelector<HTMLElement>('.m-tg-sheet-root')!);
    wrapper.unmount();
  });

  it('MTooltip describes its trigger and passes axe', async () => {
    const wrapper = mount(MTooltip, {
      props: { text: 'Copies the command' },
      slots: {
        default: ({ tipId }: { tipId: string }) =>
          h('button', { 'aria-describedby': tipId }, 'Copy'),
      },
      attachTo: document.body,
    });
    const id = wrapper.find('button').attributes('aria-describedby');
    expect(id && document.getElementById(id)?.getAttribute('role')).toBe('tooltip');
    expect(id && document.getElementById(id)?.textContent).toBe('Copies the command');
    await expectNoAxeViolations(wrapper.element);
    wrapper.unmount();
  });
});

describe('behaviour', () => {
  it('MAccordion groups items for exclusive opening unless multiple is set', () => {
    const items = [
      { id: 'a', title: 'A', body: 'a' },
      { id: 'b', title: 'B', body: 'b' },
    ];
    const names = (w: ReturnType<typeof mount>) =>
      w.findAll('details').map((d) => d.attributes('name'));

    const exclusive = names(mount(MAccordion, { props: { items } }));
    expect(new Set(exclusive).size).toBe(1);
    expect(exclusive[0]).toBeTruthy();

    expect(names(mount(MAccordion, { props: { items, multiple: true } }))).toEqual([
      undefined,
      undefined,
    ]);
  });

  it('MAccordion renders a slot named after the item id in place of the body', () => {
    const wrapper = mount(MAccordion, {
      props: { items: [{ id: 'rich', title: 'Rich' }] },
      slots: { rich: () => h('strong', 'Rich body') },
    });
    expect(wrapper.find('.m-accordion__body strong').text()).toBe('Rich body');
  });

  it('MTgOrderCard activates on click, Enter keydown and Space keyup', async () => {
    const wrapper = mount(MTgOrderCard, {
      props: { direction: 'SELL', pair: 'USDT/RUB', rate: '92.10' },
    });
    const card = wrapper.find('[role="button"]');
    expect(card.attributes('tabindex')).toBe('0');
    await card.trigger('click');
    await card.trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('click')).toHaveLength(2);
    // Space keydown only prevents scrolling, like a native button.
    const down = new KeyboardEvent('keydown', { key: ' ', cancelable: true });
    card.element.dispatchEvent(down);
    expect(down.defaultPrevented).toBe(true);
    expect(wrapper.emitted('click')).toHaveLength(2);
    await card.trigger('keyup', { key: ' ' });
    expect(wrapper.emitted('click')).toHaveLength(3);

    // A release with no press here, or after Escape or blur, does nothing.
    await card.trigger('keyup', { key: ' ' });
    await card.trigger('keydown', { key: ' ' });
    await card.trigger('keydown', { key: 'Escape' });
    await card.trigger('keyup', { key: ' ' });
    await card.trigger('keydown', { key: ' ' });
    await card.trigger('blur');
    await card.trigger('keyup', { key: ' ' });
    expect(wrapper.emitted('click')).toHaveLength(3);
  });

  it('MTgEmptyState announces loading politely and errors assertively', () => {
    const role = (variant: 'empty' | 'loading' | 'error') =>
      mount(MTgEmptyState, { props: { variant } }).attributes('role');
    expect(role('empty')).toBeUndefined();
    expect(role('loading')).toBe('status');
    expect(role('error')).toBe('alert');
    // aria-busy on a live region would hold its announcement.
    const loading = mount(MTgEmptyState, { props: { variant: 'loading' } });
    expect(loading.attributes('aria-busy')).toBeUndefined();
    expect(loading.find('svg').attributes('aria-hidden')).toBe('true');
  });

  it('MStat keeps the trend readable without colour', () => {
    const text = mount(MStat, { props: { value: '12', trend: 'down' } }).text();
    expect(text).toMatch(/12/);
    expect(text.replace('12', '').trim().length).toBeGreaterThan(0);
  });

  it('MAlert is assertive only for bad news, and can be static', () => {
    const role = (props: Record<string, unknown>) =>
      mount(MAlert, { props, slots: { default: () => 'x' } }).attributes('role');
    expect(role({ tone: 'bad' })).toBe('alert');
    expect(role({ tone: 'warn' })).toBe('status');
    expect(role({ tone: 'info' })).toBe('status');
    expect(role({ tone: 'bad', live: 'none' })).toBeUndefined();
  });

  it('MNav names its landmark', () => {
    const nav = (props: Record<string, unknown>) =>
      mount(MNav, { props: { items: [], ...props } })
        .find('nav')
        .attributes('aria-label');
    expect(nav({})).toBe('Main');
    expect(nav({ ariaLabel: 'Docs' })).toBe('Docs');
  });

  it('scrollable code and tables are reachable by keyboard', () => {
    expect(
      mount(MCodeBlock, { props: { code: 'x' } })
        .find('pre')
        .attributes('tabindex'),
    ).toBe('0');
    expect(
      mount(MYamlBlock, { props: { code: 'a: 1' } })
        .find('pre')
        .attributes('tabindex'),
    ).toBe('0');
    const table = mount(MTable, { props: { label: 'Services' } }).find('.m-table-wrap');
    expect(table.attributes('tabindex')).toBe('0');
    expect(table.attributes('role')).toBe('region');
    expect(table.attributes('aria-label')).toBe('Services');
    // Without a label the tab stop still has a role and a name.
    const unnamed = mount(MTable).find('.m-table-wrap');
    expect(unnamed.attributes('role')).toBe('region');
    expect(unnamed.attributes('aria-label')).toBe('Table');
  });
});
