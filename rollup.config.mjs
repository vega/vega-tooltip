import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import bundleSize from 'rollup-plugin-bundle-size';
import ts from 'rollup-plugin-ts';

import pkg from './package.json' assert { type: 'json' };

const plugins = (browserslist, declaration) => [
  resolve(),
  json(),
  ts({
    tsconfig: (resolvedConfig) => ({
      ...resolvedConfig,
      declaration,
      declarationMap: declaration
    }),
    transpiler: "babel",
    browserslist
  }),
  bundleSize()
];

const outputs = [
  {
    input: 'src/index.ts',
    output: {
      file: pkg.module,
      format: 'esm',
      sourcemap: true
    },
    plugins: plugins(false, true),
    external: [...Object.keys(pkg.dependencies)]
  }, {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'umd',
        name: 'vegaTooltip',
        exports: 'named',
        sourcemap: true,
        globals: {
          'vega-util': 'vega'
        },
      },
      {
        file: pkg.unpkg,
        format: 'umd',
        name: 'vegaTooltip',
        exports: 'named',
        sourcemap: true,
        globals: {
          'vega-util': 'vega'
        },
        plugins: [terser()],
      }
    ],
    plugins: plugins('defaults', false),
    external: ['vega-util']
  }
];

export default outputs;
