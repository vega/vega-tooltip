import * as tslib_1 from "tslib";
import { isArray, isObject, isString } from 'vega-util';
/**
 * Format the value to be shown in the toolip.
 *
 * @param value The value to show in the tooltip.
 * @param valueToHtml Function to convert a single cell value to an HTML string
 */
export function formatValue(value, valueToHtml, maxDepth) {
    if (isArray(value)) {
        return "[" + value.map(function (v) { return valueToHtml(isString(v) ? v : stringify(v, maxDepth)); }).join(', ') + "]";
    }
    if (isObject(value)) {
        var content = '';
        var _a = value, title = _a.title, rest = tslib_1.__rest(_a, ["title"]);
        if (title) {
            content += "<h2>" + valueToHtml(title) + "</h2>";
        }
        var keys = Object.keys(rest);
        if (keys.length > 0) {
            content += '<table>';
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                var val = rest[key];
                if (isObject(val)) {
                    val = stringify(val, maxDepth);
                }
                content += "<tr><td class=\"key\">" + valueToHtml(key) + ":</td><td class=\"value\">" + valueToHtml(val) + "</td></tr>";
            }
            content += "</table>";
        }
        return content || '{}'; // show empty object if there are no properties
    }
    return valueToHtml(value);
}
export function replacer(maxDepth) {
    var stack = [];
    return function (key, value) {
        if (typeof value !== 'object' || value === null) {
            return value;
        }
        var pos = stack.indexOf(this) + 1;
        stack.length = pos;
        if (stack.length > maxDepth) {
            return '[Object]';
        }
        if (stack.indexOf(value) >= 0) {
            return '[Circular]';
        }
        stack.push(value);
        return value;
    };
}
/**
 * Stringify any JS object to valid JSON
 */
export function stringify(obj, maxDepth) {
    return JSON.stringify(obj, replacer(maxDepth));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0VmFsdWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZm9ybWF0VmFsdWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUV4RDs7Ozs7R0FLRztBQUNILE1BQU0sc0JBQXNCLEtBQVUsRUFBRSxXQUFtQyxFQUFFLFFBQWdCO0lBQzNGLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ2xCLE9BQU8sTUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQXJELENBQXFELENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQUcsQ0FBQztLQUNoRztJQUVELElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ25CLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUVqQixJQUFNLFVBQWlDLEVBQS9CLGdCQUFLLEVBQUUsb0NBQXdCLENBQUM7UUFFeEMsSUFBSSxLQUFLLEVBQUU7WUFDVCxPQUFPLElBQUksU0FBTyxXQUFXLENBQUMsS0FBSyxDQUFDLFVBQU8sQ0FBQztTQUM3QztRQUVELElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0IsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNuQixPQUFPLElBQUksU0FBUyxDQUFDO1lBQ3JCLEtBQWtCLFVBQUksRUFBSixhQUFJLEVBQUosa0JBQUksRUFBSixJQUFJO2dCQUFqQixJQUFNLEdBQUcsYUFBQTtnQkFDWixJQUFJLEdBQUcsR0FBSSxJQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzdCLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUNqQixHQUFHLEdBQUcsU0FBUyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztpQkFDaEM7Z0JBRUQsT0FBTyxJQUFJLDJCQUF1QixXQUFXLENBQUMsR0FBRyxDQUFDLGtDQUEyQixXQUFXLENBQUMsR0FBRyxDQUFDLGVBQVksQ0FBQzthQUMzRztZQUNELE9BQU8sSUFBSSxVQUFVLENBQUM7U0FDdkI7UUFFRCxPQUFPLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQywrQ0FBK0M7S0FDeEU7SUFFRCxPQUFPLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBRUQsTUFBTSxtQkFBbUIsUUFBZ0I7SUFDdkMsSUFBTSxLQUFLLEdBQVUsRUFBRSxDQUFDO0lBRXhCLE9BQU8sVUFBb0IsR0FBVyxFQUFFLEtBQVU7UUFDaEQsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxLQUFLLElBQUksRUFBRTtZQUMvQyxPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEMsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDbkIsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLFFBQVEsRUFBRTtZQUMzQixPQUFPLFVBQVUsQ0FBQztTQUNuQjtRQUNELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDN0IsT0FBTyxZQUFZLENBQUM7U0FDckI7UUFDRCxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xCLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVEOztHQUVHO0FBQ0gsTUFBTSxvQkFBb0IsR0FBUSxFQUFFLFFBQWdCO0lBQ2xELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDakQsQ0FBQyJ9