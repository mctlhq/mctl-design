import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import MLogo from '../src/components/MLogo.vue';
import MTgStatusBadge from '../src/components/MTgStatusBadge.vue';

describe('MLogo', () => {
  it('reads a number size as px and passes a string through', () => {
    expect(mount(MLogo, { props: { size: 48 } }).attributes('style')).toContain('width: 48px');
    expect(mount(MLogo, { props: { size: '3rem' } }).attributes('style')).toContain('width: 3rem');
  });

  it('is a named image by default and hidden from AT when decorative', () => {
    const named = mount(MLogo);
    expect(named.attributes('role')).toBe('img');
    expect(named.attributes('aria-label')).toBe('MCTL');
    expect(named.attributes('aria-hidden')).toBeUndefined();

    const decorative = mount(MLogo, { props: { label: '' } });
    expect(decorative.attributes('role')).toBeUndefined();
    expect(decorative.attributes('aria-label')).toBeUndefined();
    expect(decorative.attributes('aria-hidden')).toBe('true');
  });

  it('adds the glow modifier only when asked', () => {
    expect(mount(MLogo).classes()).not.toContain('m-logo--glow');
    expect(mount(MLogo, { props: { glow: true } }).classes()).toContain('m-logo--glow');
  });
});

describe('MTgStatusBadge', () => {
  it('labels a known status and modifies its class', () => {
    const badge = mount(MTgStatusBadge, { props: { status: 'pending' } });
    expect(badge.text()).toBe('Pending');
    expect(badge.classes()).toContain('m-tg-status-badge--pending');
  });

  it('shows a status it has no label for as is', () => {
    // A plain-JS consumer on a newer backend can pass one the union lacks.
    const badge = mount(MTgStatusBadge, { props: { status: 'disputed' as 'pending' } });
    expect(badge.text()).toBe('disputed');
  });
});
