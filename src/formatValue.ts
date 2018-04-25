import { isArray, isObject, isString } from 'vega-util';

import * as stringify_ from 'json-stringify-safe';

const stringify = (stringify_ as any).default || stringify_;

/**
 * Format the value to be shown in the toolip.
 *
 * @param value The value to show in the tooltip.
 * @param valueToHtml Function to convert a single cell value to an HTML string
 */
export function formatValue(value: any, valueToHtml: (value: any) => string): string {
  if (isArray(value)) {
    return `[${value.map(v => valueToHtml(isString(v) ? v : stringify(v))).join(', ')}]`;
  }

  if (isObject(value)) {
    let content = '';

    const { title, ...rest } = value as any;

    if (title) {
      content += `<h2>${valueToHtml(title)}</h2>`;
    }

    content += '<table>';
    for (const key of Object.keys(rest)) {
      let val = (rest as any)[key];
      if (isObject(val)) {
        val = stringify(val);
      }

      content += `<tr><td class="key">${valueToHtml(key)}:</td><td class="value">${valueToHtml(val)}</td></tr>`;
    }
    content += `</table>`;

    return content;
  }

  return valueToHtml(value);
}
