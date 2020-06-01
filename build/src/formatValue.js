var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { isArray, isObject, isString } from 'vega-util';
/**
 * Format the value to be shown in the tooltip.
 *
 * @param value The value to show in the tooltip.
 * @param valueToHtml Function to convert a single cell value to an HTML string
 */
export function formatValue(value, valueToHtml, maxDepth) {
    if (isArray(value)) {
        return `[${value.map((v) => valueToHtml(isString(v) ? v : stringify(v, maxDepth))).join(', ')}]`;
    }
    if (isObject(value)) {
        let content = '';
        const _a = value, { title, image } = _a, rest = __rest(_a, ["title", "image"]);
        if (title) {
            content += `<h2>${valueToHtml(title)}</h2>`;
        }
        if (image) {
            content += `<img src="${valueToHtml(image)}">`;
        }
        const keys = Object.keys(rest);
        if (keys.length > 0) {
            content += '<table>';
            for (const key of keys) {
                let val = rest[key];
                // ignore undefined properties
                if (val === undefined) {
                    continue;
                }
                if (isObject(val)) {
                    val = stringify(val, maxDepth);
                }
                content += `<tr><td class="key">${valueToHtml(key)}:</td><td class="value">${valueToHtml(val)}</td></tr>`;
            }
            content += `</table>`;
        }
        return content || '{}'; // show empty object if there are no properties
    }
    return valueToHtml(value);
}
export function replacer(maxDepth) {
    const stack = [];
    return function (key, value) {
        if (typeof value !== 'object' || value === null) {
            return value;
        }
        const pos = stack.indexOf(this) + 1;
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
//# sourceMappingURL=formatValue.js.map