import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';

export default {
  input: 'build/src/index.js',
  output: {
    file: 'build/vega-tooltip.js',
    format: 'umd',
    sourcemap: true,
    name: 'vegaTooltip',
    exports: 'named'
  },
  plugins: [resolve(), json(), commonjs()]
};
