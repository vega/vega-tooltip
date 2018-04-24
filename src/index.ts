import { View } from 'vega-typings';

import { Options } from './defaults';
import { Handler } from './Handler';

export * from './defaults';
export * from './formatValue';
export * from './position';
export * from './Handler';

/**
 * Create a tooltip handler and register it with the provided view.
 *
 * @param view The Vega view.
 * @param opt Tooltip options.
 */
export default function(view: View, opt?: Partial<Options>) {
  const handler = new Handler(opt);

  view.tooltip(handler.call).run();

  return handler;
}
