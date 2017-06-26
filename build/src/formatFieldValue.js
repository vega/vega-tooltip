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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0RmllbGRWYWx1ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mb3JtYXRGaWVsZFZhbHVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQW1EO0FBQ25ELG1DQUFpRztBQUNqRyxpREFBMEM7QUFFMUM7Ozs7OztHQU1HO0FBQ0gsc0JBQTZCLEtBQTZCLEVBQUUsVUFBa0IsRUFBRSxNQUFjO0lBQzVGLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDMUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVELE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDbkIsS0FBSyxNQUFNO1lBQ1QsTUFBTSxDQUFDLE1BQU0sR0FBRywyQkFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQWEsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxLQUFhLENBQUMsQ0FBQztRQUNwRixLQUFLLFFBQVE7WUFDWCxNQUFNLENBQUMsTUFBTSxHQUFHLGtCQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBZSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsS0FBZSxDQUFDLENBQUM7UUFDOUYsS0FBSyxRQUFRLENBQUM7UUFDZDtZQUNFLE1BQU0sQ0FBQyxLQUFlLENBQUM7SUFDM0IsQ0FBQztBQUNILENBQUM7QUFqQkQsb0NBaUJDO0FBRUQ7OztHQUdHO0FBQ0gsb0JBQTJCLEtBQTZCO0lBQ3RELEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDOUIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxZQUFZLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDakMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2YsQ0FBQztBQUNILENBQUM7QUFSRCxnQ0FRQztBQUVEOzs7OztHQUtHO0FBQ0gsMEJBQWlDLEtBQWE7SUFDNUMsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLGtCQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsa0JBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0RixDQUFDO0FBRkQsNENBRUM7QUFFRDs7Ozs7R0FLRztBQUNILHdCQUErQixJQUFVO0lBQ3ZDLElBQU0saUJBQWlCLEdBQUcsMkJBQVUsQ0FBQyxLQUFLLENBQUMsRUFDekMsWUFBWSxHQUFHLDJCQUFVLENBQUMsS0FBSyxDQUFDLEVBQ2hDLFlBQVksR0FBRywyQkFBVSxDQUFDLE9BQU8sQ0FBQyxFQUNsQyxVQUFVLEdBQUcsMkJBQVUsQ0FBQyxPQUFPLENBQUMsRUFDaEMsU0FBUyxHQUFHLDJCQUFVLENBQUMsT0FBTyxDQUFDLEVBQy9CLFVBQVUsR0FBRywyQkFBVSxDQUFDLE9BQU8sQ0FBQyxFQUNoQyxXQUFXLEdBQUcsMkJBQVUsQ0FBQyxJQUFJLENBQUMsRUFDOUIsVUFBVSxHQUFHLDJCQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFaEMsTUFBTSxDQUFDLENBQUMsb0JBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsaUJBQWlCO1VBQy9DLG9CQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLFlBQVk7Y0FDcEMsa0JBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsWUFBWTtrQkFDbEMsaUJBQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsVUFBVTtzQkFDL0IsbUJBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxrQkFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxTQUFTLEdBQUcsVUFBVSxDQUFDOzBCQUN2RSxrQkFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxXQUFXOzhCQUNqQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBakJELHdDQWlCQyJ9