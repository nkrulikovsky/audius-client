import rollupTypescript from 'rollup-plugin-typescript2'

import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true
    },
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    }
  ],
  plugins: [rollupTypescript()]
}
