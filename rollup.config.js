import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import ts from '@wessberg/rollup-plugin-ts';
import bundleSize from 'rollup-plugin-bundle-size';
import { terser } from 'rollup-plugin-terser';

const pkg = require('./package.json');
const tsconfig = require('./tsconfig.json').compilerOptions;

const plugins = (declaration) => [
  resolve({ extensions: ['.js', '.ts'] }),
  commonjs(),
  json(),
  ts({
    tsconfig: {
      ...tsconfig,
      declaration,
      declarationMap: declaration
    },
    browserslist: 'defaults and not IE 11'
  }),
  bundleSize()
];

const outputs = [
  {
    input: 'src/index.ts',
    output: {
      file: 'build/vega-tooltip.module.js',
      format: 'esm'
    },
    plugins: plugins(true),
    external: [...Object.keys(pkg.dependencies)]
  }, {
    input: 'src/index.ts',
    output: [
      {
        file: `build/vega-tooltip.js`,
        format: 'iife',
        name: 'vegaTooltip',
        exports: 'named'
      },
      {
        file: `build/vega-tooltip.min.js`,
        format: 'iife',
        name: 'vegaTooltip',
        exports: 'named',
        plugins: [terser()]
      }
    ],
    plugins: plugins(false),
    external: ['vega']
  }
];

export default outputs;
