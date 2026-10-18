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
      // Every source file counts, imported by a test or not, so a file no test
      // touches shows up at 0% instead of being left out of the report.
      include: ['src/**/*.{ts,vue}'],
      exclude: ['src/**/*.d.ts', 'src/index.ts'],
      reporter: ['text-summary'],
      // A per-file floor, so a source file that appears in no test fails on
      // its own whatever the size of the package (a pooled total lets a small
      // one slip through). It is a presence check, not proof of behaviour: a
      // bare mount() in the a11y smoke test clears it. The bars sit at or a
      // little under the weakest file per metric today: statements MTooltip
      // 94, branches MTgStatusBadge and MLogo 50 (each has only two), lines
      // useDialog 97.
      thresholds: {
        perFile: true,
        statements: 80,
        branches: 50,
        functions: 80,
        lines: 80,
      },
    },
  },
});
