const json = require('@rollup/plugin-json');
const resolve = require('@rollup/plugin-node-resolve');
const terser = require('@rollup/plugin-terser');
const bundleSize = require('rollup-plugin-bundle-size');
const ts = require('rollup-plugin-ts');
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
    plugins: plugins('defaults', false),
    external: ['vega-util']
  }
];

module.exports = outputs;

