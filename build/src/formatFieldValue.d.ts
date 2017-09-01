/**
 * Format value using formatType and format
 * @param value - a field value to be formatted
 * @param formatType - the formatType can be: "time", "number", or "string"
 * @param format - a time time format specifier, or a time number format specifier, or undefined
 * @return the formatted value, or undefined if value or formatType is missing
 */
export declare function customFormat(value: number | string | Date, formatType: string, format: string): string;
/**
 * Automatically format a time, number or string value
 * @return the formatted time, number or string value
 */
export declare function autoFormat(value: string | number | Date): string;
/**
 * Automatically format a number based on its decimal.
 * @param value number to be formatted
 * @return If it's a decimal number, return a fixed two points precision.
 * If it's a whole number, return the original value without any format.
 */
export declare function autoNumberFormat(value: number): string;
/**
 * Automatically format a time based on its date.
 * @param date object to be formatted
 * @return a formatted time string depending on the time. For example,
 * the start of February is formatted as "February", while February second is formatted as "Feb 2".
 */
export declare function autoTimeFormat(date: Date): string;
