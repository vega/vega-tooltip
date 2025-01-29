import pkg from '../package.json';
import {View} from 'vega-typings';

import {Options} from './defaults.js';
import {Handler} from './Handler.js';

const version = pkg.version;

export * from './defaults.js';
export * from './formatValue.js';
export * from './position.js';
export * from './Handler.js';
export {version};

/**
 * Create a tooltip handler and register it with the provided view.
 *
 * @param view The Vega view.
 * @param opt Tooltip options.
 */
export default function (view: View, opt?: Options) {
  const handler = new Handler(opt);

  view.tooltip(handler.call).run();

  return handler;
}
