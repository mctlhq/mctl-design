import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/tailwind-preset.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  // Inline token values so the published preset needs no @mctlhq/tokens
  // at the consumer's runtime.
  noExternal: ['@mctlhq/tokens'],
});
