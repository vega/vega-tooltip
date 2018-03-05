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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0RmllbGRWYWx1ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mb3JtYXRGaWVsZFZhbHVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQW1EO0FBQ25ELG1DQUFpRztBQUNqRyxpREFBMEM7QUFDMUMsdUNBQWlFO0FBR2pFOzs7Ozs7R0FNRztBQUNILHNCQUE2QixLQUEwQixFQUFFLFVBQWtCLEVBQUUsTUFBK0I7SUFDMUcsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMxQyxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDM0IsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsb0JBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckIsTUFBTSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNuQixLQUFLLE1BQU07Z0JBQ1QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsMkJBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLEtBQWEsQ0FBQyxDQUFDO1lBQ3BGLEtBQUssUUFBUTtnQkFDWCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxrQkFBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFlLENBQUMsQ0FBQztZQUM5RixLQUFLLFFBQVEsQ0FBQztZQUNkO2dCQUNFLE1BQU0sQ0FBQyxLQUFlLENBQUM7UUFDM0IsQ0FBQztJQUNILENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxzQkFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ25CLENBQUM7QUF6QkQsb0NBeUJDO0FBRUQ7OztHQUdHO0FBQ0gsb0JBQTJCLEtBQTBCO0lBQ25ELEVBQUUsQ0FBQyxDQUFDLG9CQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGtCQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNmLENBQUM7QUFDSCxDQUFDO0FBUkQsZ0NBUUM7QUFFRDs7Ozs7R0FLRztBQUNILDBCQUFpQyxLQUFhO0lBQzVDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0RixDQUFDO0FBRkQsNENBRUM7QUFFRDs7Ozs7R0FLRztBQUNILHdCQUErQixJQUFVO0lBQ3ZDLElBQU0saUJBQWlCLEdBQUcsMkJBQVUsQ0FBQyxLQUFLLENBQUMsRUFDekMsWUFBWSxHQUFHLDJCQUFVLENBQUMsS0FBSyxDQUFDLEVBQ2hDLFlBQVksR0FBRywyQkFBVSxDQUFDLE9BQU8sQ0FBQyxFQUNsQyxVQUFVLEdBQUcsMkJBQVUsQ0FBQyxPQUFPLENBQUMsRUFDaEMsU0FBUyxHQUFHLDJCQUFVLENBQUMsT0FBTyxDQUFDLEVBQy9CLFVBQVUsR0FBRywyQkFBVSxDQUFDLE9BQU8sQ0FBQyxFQUNoQyxXQUFXLEdBQUcsMkJBQVUsQ0FBQyxJQUFJLENBQUMsRUFDOUIsVUFBVSxHQUFHLDJCQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFaEMsTUFBTSxDQUFDLENBQUMsb0JBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLGlCQUFpQjtRQUNqRCxDQUFDLENBQUMsb0JBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFlBQVk7WUFDdEMsQ0FBQyxDQUFDLGtCQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZO2dCQUNwQyxDQUFDLENBQUMsaUJBQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVU7b0JBQ2pDLENBQUMsQ0FBQyxtQkFBUyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxrQkFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7d0JBQ3pFLENBQUMsQ0FBQyxrQkFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsV0FBVzs0QkFDbkMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xDLENBQUM7QUFqQkQsd0NBaUJDIn0=