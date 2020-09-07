import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import ts from '@wessberg/rollup-plugin-ts';
import bundleSize from 'rollup-plugin-bundle-size';
import { terser } from 'rollup-plugin-terser';

const pkg = require('./package.json');

const plugins = (browserslist, declaration) => [
  resolve(),
  json(),
  ts({
    tsconfig: (resolvedConfig) => ({
      ...resolvedConfig,
      declaration,
      declarationMap: declaration
    }),
    browserslist
  }),
  bundleSize()
];

const outputs = [
  {
    input: 'src/index.ts',
    output: {
      file: pkg.module,
      format: 'esm'
    },
    plugins: plugins(undefined, true),
    external: [...Object.keys(pkg.dependencies)]
  }, {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'umd',
        name: 'vegaTooltip',
        exports: 'named',
        globals: {
          'vega-util': 'vega'
        },
      },
      {
        file: pkg.unpkg,
        format: 'iife',
        name: 'vegaTooltip',
        exports: 'named',
        globals: {
          'vega-util': 'vega'
        },
        plugins: [terser()],
      }
    ],
    plugins: plugins('defaults and not IE 11', false),
    external: ['vega-util']
  }
];

export default outputs;
