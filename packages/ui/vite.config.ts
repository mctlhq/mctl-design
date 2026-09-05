import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    vue(),
    dts({ tsconfigPath: './tsconfig.json', cleanVueFileName: true, rollupTypes: true }),
  ],
  build: {
    // Pinned, not inherited. vite 7 moved the default from 'modules'
    // (es2020, chrome87, edge88, firefox78, safari14) to
    // 'baseline-widely-available' (chrome107, edge107, firefox104, safari16),
    // so upgrading vite would otherwise have raised the published browser
    // floor of @mctlhq/ui as a side effect -- invisible to lint, typecheck
    // and both builds, and surfacing only as a syntax error in an old
    // browser. Raising the floor is a decision for the design system to
    // make on its own schedule; this list is the floor as it was before
    // vite 7.
    target: ['es2020', 'chrome87', 'edge88', 'firefox78', 'safari14'],
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        assetFileNames: 'mctl-ui.[ext]',
        globals: { vue: 'Vue' },
      },
    },
  },
});
