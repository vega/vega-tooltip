import {isArray, isObject, isString} from 'vega-util';

/**
 * Format the value to be shown in the tooltip.
 *
 * @param value The value to show in the tooltip.
 * @param valueToHtml Function to convert a single cell value to an HTML string
 */
export function formatValue(value: any, valueToHtml: (value: any) => string, maxDepth: number): string {
  if (isArray(value)) {
    return `[${value.map((v) => valueToHtml(isString(v) ? v : stringify(v, maxDepth))).join(', ')}]`;
  }

  if (isObject(value)) {
    let content = '';

    const {title, image, ...rest} = value as any; 

    if (title) {
      content += `<h2>${valueToHtml(title)}</h2>`;
    }

    if (image) {
      content += `<img src="${valueToHtml(image)}">`;
    }

    const keys = Object.keys(rest);
    if (keys.length > 0) {
      content += '<table>';
      var kv_list = [];
      var sort_tooltip: string | undefined = undefined
      for (const key of keys) {
        // Do not show the sort placeholder field to users.
        if (key == "tooltip_sort_placeholder") {
          sort_tooltip = (rest as any)[key];
          continue;
        }

        let val = (rest as any)[key];

        // ignore undefined properties
        if (val === undefined) {
          continue;
        }

        if (isObject(val)) {
          val = stringify(val, maxDepth);
        }

        const kv: [string, any] = [key, val];
        kv_list.push(kv);
      }

      if (sort_tooltip != undefined) {
        const order: number = sort_tooltip == "0" ? 1 : -1; // order = 1: ascending, order = -1: descending
        kv_list = kv_list.sort((n1,n2) => order * (n1[1] - n2[1])); // Sort by values.
      }
      for (const kv of kv_list) {
        content += `<tr><td class="key">${valueToHtml(kv[0])}:</td><td class="value">${valueToHtml(kv[1])}</td></tr>`;
      }
      content += `</table>`;
    }

    return content || '{}'; // show empty object if there are no properties
  }

  return valueToHtml(value);
}

export function replacer(maxDepth: number) {
  const stack: any[] = [];

  return function (this: any, key: string, value: any) {
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
export function stringify(obj: any, maxDepth: number) {
  return JSON.stringify(obj, replacer(maxDepth));
}
