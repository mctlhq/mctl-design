import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    include: ['test/**/*.test.ts'],
    coverage: {
      enabled: true,
      provider: 'v8',
      // Every source file counts, imported by a test or not, so a new
      // untested component drags the totals down instead of being invisible.
      include: ['src/**/*.{ts,vue}'],
      exclude: ['src/**/*.d.ts', 'src/index.ts'],
      reporter: ['text-summary'],
      // A floor a little under the current totals: it catches a component
      // landing without tests, not a single missed branch.
      thresholds: {
        statements: 95,
        branches: 82,
        functions: 95,
        lines: 96,
      },
    },
  },
});
