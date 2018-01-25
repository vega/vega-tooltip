"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3_format_1 = require("d3-format");
var d3_time_1 = require("d3-time");
var d3_time_format_1 = require("d3-time-format");
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
    if (!formatType) {
        return undefined;
    }
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
exports.customFormat = customFormat;
/**
 * Automatically format a time, number or string value
 * @return the formatted time, number or string value
 */
function autoFormat(value) {
    if (typeof value === 'number') {
        return autoNumberFormat(value);
    }
    else if (value instanceof Date) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0RmllbGRWYWx1ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mb3JtYXRGaWVsZFZhbHVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQW1EO0FBQ25ELG1DQUFpRztBQUNqRyxpREFBMEM7QUFFMUM7Ozs7OztHQU1HO0FBQ0gsc0JBQTZCLEtBQTZCLEVBQUUsVUFBa0IsRUFBRSxNQUFjO0lBQzVGLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDMUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVELE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDbkIsS0FBSyxNQUFNO1lBQ1QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsMkJBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLEtBQWEsQ0FBQyxDQUFDO1FBQ3BGLEtBQUssUUFBUTtZQUNYLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGtCQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEtBQWUsQ0FBQyxDQUFDO1FBQzlGLEtBQUssUUFBUSxDQUFDO1FBQ2Q7WUFDRSxNQUFNLENBQUMsS0FBZSxDQUFDO0lBQzNCLENBQUM7QUFDSCxDQUFDO0FBakJELG9DQWlCQztBQUVEOzs7R0FHRztBQUNILG9CQUEyQixLQUE2QjtJQUN0RCxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssWUFBWSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNmLENBQUM7QUFDSCxDQUFDO0FBUkQsZ0NBUUM7QUFFRDs7Ozs7R0FLRztBQUNILDBCQUFpQyxLQUFhO0lBQzVDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0RixDQUFDO0FBRkQsNENBRUM7QUFFRDs7Ozs7R0FLRztBQUNILHdCQUErQixJQUFVO0lBQ3ZDLElBQU0saUJBQWlCLEdBQUcsMkJBQVUsQ0FBQyxLQUFLLENBQUMsRUFDekMsWUFBWSxHQUFHLDJCQUFVLENBQUMsS0FBSyxDQUFDLEVBQ2hDLFlBQVksR0FBRywyQkFBVSxDQUFDLE9BQU8sQ0FBQyxFQUNsQyxVQUFVLEdBQUcsMkJBQVUsQ0FBQyxPQUFPLENBQUMsRUFDaEMsU0FBUyxHQUFHLDJCQUFVLENBQUMsT0FBTyxDQUFDLEVBQy9CLFVBQVUsR0FBRywyQkFBVSxDQUFDLE9BQU8sQ0FBQyxFQUNoQyxXQUFXLEdBQUcsMkJBQVUsQ0FBQyxJQUFJLENBQUMsRUFDOUIsVUFBVSxHQUFHLDJCQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFaEMsTUFBTSxDQUFDLENBQUMsb0JBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLGlCQUFpQjtRQUNqRCxDQUFDLENBQUMsb0JBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFlBQVk7WUFDdEMsQ0FBQyxDQUFDLGtCQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZO2dCQUNwQyxDQUFDLENBQUMsaUJBQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVU7b0JBQ2pDLENBQUMsQ0FBQyxtQkFBUyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxrQkFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7d0JBQ3pFLENBQUMsQ0FBQyxrQkFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsV0FBVzs0QkFDbkMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xDLENBQUM7QUFqQkQsd0NBaUJDIn0=