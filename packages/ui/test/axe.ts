import axe from 'axe-core';
import { expect } from 'vitest';

// jsdom has no layout or paint, so axe's colour-contrast rule cannot compute
// anything there; contrast is checked against the tokens instead. Every other
// rule (roles, names, ARIA references, focusable regions) runs as in a browser.
export async function expectNoAxeViolations(el: Element) {
  const { violations } = await axe.run(el, { rules: { 'color-contrast': { enabled: false } } });
  expect(violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
}
