import { afterEach, beforeAll, expect } from 'vitest';
import { setProjectAnnotations } from '@storybook/vue3-vite';
import * as a11yAnnotations from '@storybook/addon-a11y/preview';
import * as projectAnnotations from './preview';

// Each vitest project (vitest.config.ts) pins one canvas theme.
const theme = import.meta.env.VITE_STORY_THEME;
const annotations = setProjectAnnotations([
  a11yAnnotations,
  projectAnnotations,
  { initialGlobals: { theme } },
]);
beforeAll(annotations.beforeAll);

// If the pin stopped applying, the light project would quietly re-run the
// dark one and stay green; fail instead.
afterEach(() => {
  expect(document.documentElement.dataset.theme).toBe(theme);
});
