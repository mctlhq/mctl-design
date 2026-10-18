import { beforeAll } from 'vitest';
import { setProjectAnnotations } from '@storybook/vue3-vite';
import * as a11yAnnotations from '@storybook/addon-a11y/preview';
import * as projectAnnotations from './preview';

// Each vitest project (vitest.config.ts) pins one canvas theme.
const annotations = setProjectAnnotations([
  a11yAnnotations,
  projectAnnotations,
  { initialGlobals: { theme: import.meta.env.VITE_STORY_THEME } },
]);
beforeAll(annotations.beforeAll);
