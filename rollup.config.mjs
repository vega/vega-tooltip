import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import bundleSize from 'rollup-plugin-bundle-size';

import pkg from './package.json' assert { type: 'json' };

const plugins = (declaration) => [
  resolve(),
  json(),
  typescript({
    compilerOptions: {
      outDir: 'build',
      declaration,
      declarationMap: declaration,
    },
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
    plugins: plugins(true),
    external: Object.keys(pkg.dependencies)
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
    plugins: plugins(false),
    external: ['vega-util']
  }
];

export default outputs;
