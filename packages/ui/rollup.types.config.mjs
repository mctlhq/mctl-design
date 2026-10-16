import { rmSync } from 'node:fs';
import { dts } from 'rollup-plugin-dts';

export default {
  input: '.types/index.d.ts',
  output: { file: 'dist/index.d.ts', format: 'es' },
  external: ['vue'],
  plugins: [dts(), { name: 'clean-types', closeBundle() { rmSync('.types', { recursive: true, force: true }); } }],
};
