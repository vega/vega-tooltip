import json from '@rollup/plugin-json';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import bundleSize from 'rollup-plugin-bundle-size';

import pkg from './package.json' with {type: 'json'};

const outputs = [
  {
    input: 'src/index.ts',
    output: {
      file: pkg.exports.default,
      format: 'esm',
      sourcemap: true,
    },
    plugins: [nodeResolve(), json(), typescript()],
    external: Object.keys(pkg.dependencies),
  },
  {
    input: 'src/index.ts',
    output: {
      file: pkg.unpkg,
      format: 'umd',
      name: 'vegaTooltip',
      exports: 'named',
      sourcemap: true,
      globals: {
        'vega-util': 'vega',
      },
    },
    plugins: [nodeResolve(), json(), typescript(), terser(), bundleSize()],
    external: ['vega-util'],
  },
];

export default outputs;
