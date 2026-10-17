import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['**/dist/**', '**/storybook-static/**', '**/.turbo/**', '**/node_modules/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
  },
  {
    // TypeScript already reports undefined names, and knows the DOM types.
    // eslint-plugin-vue 10 no longer declares browser globals, so core
    // no-undef flags every `document` / `HTMLElement` in a TS-only codebase.
    // typescript-eslint recommends turning it off for TS sources.
    files: ['**/*.ts', '**/*.vue'],
    rules: { 'no-undef': 'off' },
  },
  {
    // Build scripts run on Node; nothing else declares its globals.
    files: ['**/scripts/**/*.mjs'],
    languageOptions: { globals: globals.node },
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      // Formatting is owned by Prettier — disable the overlapping vue rules.
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-indent': 'off',
      // Only void elements fight Prettier, which writes <input />; keep the
      // rule for normal elements and components. Still a warning, but every
      // lint script runs with --max-warnings 0, so warnings fail CI too.
      'vue/html-self-closing': ['warn', { html: { void: 'any' } }],
    },
  },
);
