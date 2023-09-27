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
    //document.write(JSON.stringify(value));
    let content = '';

    const {title, image, ...rest} = value as any; // add conditions in parallel with title, image? 

    if (title) {
      content += `<h2>${valueToHtml(title)}</h2>`;
    }

    if (image) {
      content += `<img src="${valueToHtml(image)}">`;
    }

    const keys = Object.keys(rest);
    if (keys.length > 0) {
      content += '<table>';
      
      let kv_list = [];
      for (const key of keys) {
        let val = (rest as any)[key];

        // ignore undefined properties
        if (val === undefined) {
          continue;
        }

        if (isObject(val)) {
          val = stringify(val, maxDepth);
        }
        
        // The trick is here! 
        // TODO: to be generic, should pass a condition parameter to specify what value to show.
        if (val == 0) {
          continue;
        }
        let kv: [string, number] = [key, val];
        kv_list.push(kv);
        //content += `<tr><td class="key">${valueToHtml(key)}:</td><td class="value">${valueToHtml(val)}</td></tr>`;
      }
      // TODO: to be generic, should pass 1) by key or by value? 2) how to sort? (ascending/descending).
      let kv_list_sorted = kv_list.sort((n1,n2) => -(n1[1] - n2[1])); // Sort by values.
      for (const kv of kv_list_sorted) {
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
