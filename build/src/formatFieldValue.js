"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3_format_1 = require("d3-format");
var d3_time_1 = require("d3-time");
var d3_time_format_1 = require("d3-time-format");
var vega_util_1 = require("vega-util");
/**
 * Format value using formatType and format
 * @param value - a field value to be formatted
 * @param formatType - the formatType can be: "time", "number", or "string"
 * @param format - a time time format specifier, or a time number format specifier, or undefined
 * @return the formatted value, or undefined if value or formatType is missing
 */
function customFormat(value, formatType, format) {
    if (value === undefined || value === null) {
        return undefined;
    }
    if (!formatType && !format) {
        return undefined;
    }
    if (vega_util_1.isString(format)) {
        switch (formatType) {
            case 'time':
                return format ? d3_time_format_1.timeFormat(format)(value) : autoTimeFormat(value);
            case 'number':
                return format ? d3_format_1.format(format)(value) : autoNumberFormat(value);
            case 'string':
            default:
                return value;
        }
    }
    if (vega_util_1.isFunction(format)) {
        return format(value);
    }
    return undefined;
}
exports.customFormat = customFormat;
/**
 * Automatically format a time, number or string value
 * @return the formatted time, number or string value
 */
function autoFormat(value) {
    if (vega_util_1.isNumber(value)) {
        return autoNumberFormat(value);
    }
    else if (vega_util_1.isDate(value)) {
        return autoTimeFormat(value);
    }
    else {
        return value;
    }
}
exports.autoFormat = autoFormat;
/**
 * Automatically format a number based on its decimal.
 * @param value number to be formatted
 * @return If it's a decimal number, return a fixed two points precision.
 * If it's a whole number, return the original value without any format.
 */
function autoNumberFormat(value) {
    return value % 1 === 0 ? d3_format_1.format(',')(value) : d3_format_1.format(',.2f')(value);
}
exports.autoNumberFormat = autoNumberFormat;
/**
 * Automatically format a time based on its date.
 * @param date object to be formatted
 * @return a formatted time string depending on the time. For example,
 * the start of February is formatted as "February", while February second is formatted as "Feb 2".
 */
function autoTimeFormat(date) {
    var formatMillisecond = d3_time_format_1.timeFormat('.%L'), formatSecond = d3_time_format_1.timeFormat(':%S'), formatMinute = d3_time_format_1.timeFormat('%I:%M'), formatHour = d3_time_format_1.timeFormat('%I %p'), formatDay = d3_time_format_1.timeFormat('%a %d'), formatWeek = d3_time_format_1.timeFormat('%b %d'), formatMonth = d3_time_format_1.timeFormat('%B'), formatYear = d3_time_format_1.timeFormat('%Y');
    return (d3_time_1.timeSecond(date) < date ? formatMillisecond
        : d3_time_1.timeMinute(date) < date ? formatSecond
            : d3_time_1.timeHour(date) < date ? formatMinute
                : d3_time_1.timeDay(date) < date ? formatHour
                    : d3_time_1.timeMonth(date) < date ? (d3_time_1.timeWeek(date) < date ? formatDay : formatWeek)
                        : d3_time_1.timeYear(date) < date ? formatMonth
                            : formatYear)(date);
}
exports.autoTimeFormat = autoTimeFormat;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0RmllbGRWYWx1ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mb3JtYXRGaWVsZFZhbHVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQW1EO0FBQ25ELG1DQUFpRztBQUNqRyxpREFBMEM7QUFDMUMsdUNBQWlFO0FBR2pFOzs7Ozs7R0FNRztBQUNILHNCQUE2QixLQUEwQixFQUFFLFVBQWtCLEVBQUUsTUFBK0I7SUFDMUcsSUFBSSxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7UUFDekMsT0FBTyxTQUFTLENBQUM7S0FDbEI7SUFDRCxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQzFCLE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0lBRUQsSUFBSSxvQkFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ3BCLFFBQVEsVUFBVSxFQUFFO1lBQ2xCLEtBQUssTUFBTTtnQkFDVCxPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsMkJBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLEtBQWEsQ0FBQyxDQUFDO1lBQ3BGLEtBQUssUUFBUTtnQkFDWCxPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsa0JBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsS0FBZSxDQUFDLENBQUM7WUFDOUYsS0FBSyxRQUFRLENBQUM7WUFDZDtnQkFDRSxPQUFPLEtBQWUsQ0FBQztTQUMxQjtLQUNGO0lBRUQsSUFBSSxzQkFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ3RCLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3RCO0lBRUQsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQXpCRCxvQ0F5QkM7QUFFRDs7O0dBR0c7QUFDSCxvQkFBMkIsS0FBMEI7SUFDbkQsSUFBSSxvQkFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ25CLE9BQU8sZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDaEM7U0FBTSxJQUFJLGtCQUFNLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDeEIsT0FBTyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDOUI7U0FBTTtRQUNMLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7QUFDSCxDQUFDO0FBUkQsZ0NBUUM7QUFFRDs7Ozs7R0FLRztBQUNILDBCQUFpQyxLQUFhO0lBQzVDLE9BQU8sS0FBSyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdEYsQ0FBQztBQUZELDRDQUVDO0FBRUQ7Ozs7O0dBS0c7QUFDSCx3QkFBK0IsSUFBVTtJQUN2QyxJQUFNLGlCQUFpQixHQUFHLDJCQUFVLENBQUMsS0FBSyxDQUFDLEVBQ3pDLFlBQVksR0FBRywyQkFBVSxDQUFDLEtBQUssQ0FBQyxFQUNoQyxZQUFZLEdBQUcsMkJBQVUsQ0FBQyxPQUFPLENBQUMsRUFDbEMsVUFBVSxHQUFHLDJCQUFVLENBQUMsT0FBTyxDQUFDLEVBQ2hDLFNBQVMsR0FBRywyQkFBVSxDQUFDLE9BQU8sQ0FBQyxFQUMvQixVQUFVLEdBQUcsMkJBQVUsQ0FBQyxPQUFPLENBQUMsRUFDaEMsV0FBVyxHQUFHLDJCQUFVLENBQUMsSUFBSSxDQUFDLEVBQzlCLFVBQVUsR0FBRywyQkFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWhDLE9BQU8sQ0FBQyxvQkFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQWlCO1FBQ2pELENBQUMsQ0FBQyxvQkFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsWUFBWTtZQUN0QyxDQUFDLENBQUMsa0JBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFlBQVk7Z0JBQ3BDLENBQUMsQ0FBQyxpQkFBTyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVTtvQkFDakMsQ0FBQyxDQUFDLG1CQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQzt3QkFDekUsQ0FBQyxDQUFDLGtCQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxXQUFXOzRCQUNuQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQWpCRCx3Q0FpQkMifQ==