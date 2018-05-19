import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss'

export default {
  input: 'build/index.js',
  output: {
    file: 'build/vega-tooltip.js',
    format: 'umd',
    sourcemap: true,
    name: 'vegaTooltip',
    exports: 'named'
  },
  plugins: [
    resolve(),
    commonjs(),
    postcss({
      inject: false
    })
  ]
};
