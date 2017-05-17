import {format as d3NumberFormat} from 'd3-format';
import {timeDay, timeHour, timeMinute, timeMonth, timeSecond, timeWeek, timeYear} from 'd3-time';
import {timeFormat} from 'd3-time-format';

/**
 * Format value using formatType and format
 * @param value - a field value to be formatted
 * @param formatType - the formatType can be: "time", "number", or "string"
 * @param format - a time time format specifier, or a time number format specifier, or undefined
 * @return the formatted value, or undefined if value or formatType is missing
 */
export function customFormat(value: number | string | Date, formatType: string, format: string): string {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (!formatType) {
    return undefined;
  }

  switch (formatType) {
    case 'time':
      return format ? timeFormat(format)(value as Date) : autoTimeFormat(value as Date);
    case 'number':
      return format ? d3NumberFormat(format)(value as number) : autoNumberFormat(value as number);
    case 'string':
    default:
      return value as string;
  }
}

/**
 * Automatically format a time, number or string value
 * @return the formatted time, number or string value
 */
export function autoFormat(value: string | number | Date): string {
  if (typeof value === 'number') {
    return autoNumberFormat(value);
  } else if (value instanceof Date) {
    return autoTimeFormat(value);
  } else {
    return value;
  }
}

/**
 * Automatically format a number based on its decimal.
 * @param value number to be formatted
 * @return If it's a decimal number, return a fixed two points precision.
 * If it's a whole number, return the original value without any format.
 */
export function autoNumberFormat(value: number) {
  return value % 1 === 0 ? d3NumberFormat(',')(value) : d3NumberFormat(',.2f')(value);
}

/**
 * Automatically format a time based on its date.
 * @param date object to be formatted
 * @return a formatted time string depending on the time. For example,
 * the start of February is formatted as "February", while February second is formatted as "Feb 2".
 */
export function autoTimeFormat(date: Date) {
  const formatMillisecond = timeFormat('.%L'),
    formatSecond = timeFormat(':%S'),
    formatMinute = timeFormat('%I:%M'),
    formatHour = timeFormat('%I %p'),
    formatDay = timeFormat('%a %d'),
    formatWeek = timeFormat('%b %d'),
    formatMonth = timeFormat('%B'),
    formatYear = timeFormat('%Y');

  return (timeSecond(date) < date ? formatMillisecond
    : timeMinute(date) < date ? formatSecond
      : timeHour(date) < date ? formatMinute
        : timeDay(date) < date ? formatHour
          : timeMonth(date) < date ? (timeWeek(date) < date ? formatDay : formatWeek)
            : timeYear(date) < date ? formatMonth
              : formatYear)(date);
}
