/**
 * Format the value to be shown in the toolip.
 *
 * @param value The value to show in the tooltip.
 * @param valueToHtml Function to convert a single cell value to an HTML string
 */
export declare function formatValue(value: any, valueToHtml: (value: any) => string, maxDepth: number): string;
export declare function replacer(maxDepth: number): (this: any, key: string, value: any) => any;
/**
 * Stringify any JS object to valid JSON
 */
export declare function stringify(obj: any, maxDepth: number): string;
