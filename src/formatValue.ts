import {isArray, isObject, isString} from 'vega-util';
import type {Options} from './defaults.js';

/**
 * Format the value to be shown in the tooltip.
 *
 * @param value The value to show in the tooltip.
 * @param valueToHtml Function to convert a single cell value to an HTML string
 */
export function formatValue(
  value: any,
  valueToHtml: (value: any) => string,
  maxDepth: number,
  baseURL?: string,
  options?: Pick<Options, 'titleKey' | 'imageKeys'>,
): string {
  if (isArray(value)) {
    return `[${value.map((v) => valueToHtml(isString(v) ? v : stringify(v, maxDepth))).join(', ')}]`;
  }

  if (isObject(value)) {
    let content = '';
    const fields = value as Record<string, unknown>;

    const titleKey = options?.titleKey === undefined ? 'title' : options.titleKey;
    const imageKeys = options?.imageKeys ?? ['image'];
    const title = titleKey === null ? undefined : fields[titleKey];

    if (title) {
      content += `<h2>${valueToHtml(title)}</h2>`;
    }

    for (const key of imageKeys) {
      const image = fields[key];
      if (image) {
        content += `<img src="${new URL(valueToHtml(image), baseURL || location.href).href}">`;
      }
    }

    const keys = Object.keys(fields).filter((key) => key !== titleKey && !imageKeys.includes(key));
    if (keys.length > 0) {
      content += '<table>';
      for (const key of keys) {
        let val = fields[key];

        // ignore undefined properties
        if (val === undefined) {
          continue;
        }

        if (isObject(val)) {
          val = stringify(val, maxDepth);
        }

        content += `<tr><td class="key">${valueToHtml(key)}</td><td class="value">${valueToHtml(val)}</td></tr>`;
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
