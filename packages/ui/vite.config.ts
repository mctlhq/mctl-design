import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    // Pinned, not inherited: vite's default moves with vite releases, and the
    // published floor of @mctlhq/ui should move only when this list does.
    // The floor is set by what the CSS already requires, color-mix()
    // (Chrome/Edge 111, Firefox 113, Safari 16.2); an older floor here only
    // made the JS look more compatible than the components are. README
    // "Browser support" states the same list.
    target: ['es2020', 'chrome111', 'edge111', 'firefox113', 'safari16.2'],
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
