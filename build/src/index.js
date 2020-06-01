import pkg from '../package.json';
import { Handler } from './Handler';
const version = pkg.version;
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
export default function (view, opt) {
    const handler = new Handler(opt);
    view.tooltip(handler.call).run();
    return handler;
}
//# sourceMappingURL=index.js.map