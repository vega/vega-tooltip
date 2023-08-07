import { View, TooltipHandler } from 'vega-typings';
/**
 * Format the value to be shown in the tooltip.
 *
 * @param value The value to show in the tooltip.
 * @param valueToHtml Function to convert a single cell value to an HTML string
 */
declare function formatValue(value: any, valueToHtml: (value: any) => string, maxDepth: number): string;
declare function replacer(maxDepth: number): (this: any, key: string, value: any) => any;
/**
 * Stringify any JS object to valid JSON
 */
declare function stringify(obj: any, maxDepth: number): string;
declare const DEFAULT_OPTIONS: {
    offsetX: number;
    offsetY: number;
    id: string;
    styleId: string;
    theme: string;
    disableDefaultStyle: boolean;
    sanitize: typeof escapeHTML;
    maxDepth: number;
    formatTooltip: typeof formatValue;
};
type Options = Partial<typeof DEFAULT_OPTIONS>;
/**
 * Escape special HTML characters.
 *
 * @param value A value to convert to string and HTML-escape.
 */
declare function escapeHTML(value: any): string;
declare function createDefaultStyle(id: string): string;
/**
 * The tooltip handler class.
 */
declare class Handler {
    /**
     * The handler function. We bind this to this function in the constructor.
     */
    call: TooltipHandler;
    /**
     * Complete tooltip options.
     */
    private options;
    /**
     * The tooltip html element.
     */
    private el;
    /**
     * Create the tooltip handler and initialize the element and style.
     *
     * @param options Tooltip Options
     */
    constructor(options?: Options);
    /**
     * The tooltip handler function.
     */
    private tooltipHandler;
}
declare const version: string;
/**
 * Position the tooltip
 *
 * @param event The mouse event.
 * @param tooltipBox
 * @param offsetX Horizontal offset.
 * @param offsetY Vertical offset.
 */
declare function calculatePosition(event: MouseEvent, tooltipBox: {
    width: number;
    height: number;
}, offsetX: number, offsetY: number): {
    x: number;
    y: number;
};
/**
 * Create a tooltip handler and register it with the provided view.
 *
 * @param view The Vega view.
 * @param opt Tooltip options.
 */
declare function indexFunc(view: View, opt?: Options): Handler;
export { DEFAULT_OPTIONS, Options, escapeHTML, createDefaultStyle, formatValue, replacer, stringify, calculatePosition, Handler, version, indexFunc as default };
//# sourceMappingURL=vega-tooltip.module.d.ts.map