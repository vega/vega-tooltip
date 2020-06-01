import { View } from 'vega-typings';
import { Options } from './defaults';
import { Handler } from './Handler';
declare const version: string;
export * from './defaults';
export * from './formatValue';
export * from './position';
export * from './Handler';
export { version };
/**
 * Create a tooltip handler and register it with the provided view.
 *
 * @param view The Vega view.
 * @param opt Tooltip options.
 */
export default function (view: View, opt?: Options): Handler;
//# sourceMappingURL=index.d.ts.map