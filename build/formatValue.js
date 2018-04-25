import * as tslib_1 from "tslib";
import { isArray, isObject, isString } from 'vega-util';
import * as stringify_ from 'json-stringify-safe';
var stringify = stringify_.default || stringify_;
/**
 * Format the value to be shown in the toolip.
 *
 * @param value The value to show in the tooltip.
 * @param valueToHtml Function to convert a single cell value to an HTML string
 */
export function formatValue(value, valueToHtml) {
    if (isArray(value)) {
        return "[" + value.map(function (v) { return valueToHtml(isString(v) ? v : stringify(v)); }).join(', ') + "]";
    }
    if (isObject(value)) {
        var content = '';
        var _a = value, title = _a.title, rest = tslib_1.__rest(_a, ["title"]);
        if (title) {
            content += "<h2>" + valueToHtml(title) + "</h2>";
        }
        content += '<table>';
        for (var _i = 0, _b = Object.keys(rest); _i < _b.length; _i++) {
            var key = _b[_i];
            var val = rest[key];
            if (isObject(val)) {
                val = stringify(val);
            }
            content += "<tr><td class=\"key\">" + valueToHtml(key) + ":</td><td class=\"value\">" + valueToHtml(val) + "</td></tr>";
        }
        content += "</table>";
        return content;
    }
    return valueToHtml(value);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0VmFsdWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZm9ybWF0VmFsdWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUV4RCxPQUFPLEtBQUssVUFBVSxNQUFNLHFCQUFxQixDQUFDO0FBRWxELElBQU0sU0FBUyxHQUFJLFVBQWtCLENBQUMsT0FBTyxJQUFJLFVBQVUsQ0FBQztBQUU1RDs7Ozs7R0FLRztBQUNILE1BQU0sc0JBQXNCLEtBQVUsRUFBRSxXQUFtQztJQUN6RSxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNsQixPQUFPLE1BQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQTNDLENBQTJDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQUcsQ0FBQztLQUN0RjtJQUVELElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ25CLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUVqQixJQUFNLFVBQWlDLEVBQS9CLGdCQUFLLEVBQUUsb0NBQXdCLENBQUM7UUFFeEMsSUFBSSxLQUFLLEVBQUU7WUFDVCxPQUFPLElBQUksU0FBTyxXQUFXLENBQUMsS0FBSyxDQUFDLFVBQU8sQ0FBQztTQUM3QztRQUVELE9BQU8sSUFBSSxTQUFTLENBQUM7UUFDckIsS0FBa0IsVUFBaUIsRUFBakIsS0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFqQixjQUFpQixFQUFqQixJQUFpQjtZQUE5QixJQUFNLEdBQUcsU0FBQTtZQUNaLElBQUksR0FBRyxHQUFJLElBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM3QixJQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDakIsR0FBRyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN0QjtZQUVELE9BQU8sSUFBSSwyQkFBdUIsV0FBVyxDQUFDLEdBQUcsQ0FBQyxrQ0FBMkIsV0FBVyxDQUFDLEdBQUcsQ0FBQyxlQUFZLENBQUM7U0FDM0c7UUFDRCxPQUFPLElBQUksVUFBVSxDQUFDO1FBRXRCLE9BQU8sT0FBTyxDQUFDO0tBQ2hCO0lBRUQsT0FBTyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDNUIsQ0FBQyJ9