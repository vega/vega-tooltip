import * as stringify_ from 'json-stringify-pretty-compact';
import { TooltipHandler, View } from 'vega-typings';
import { isArray, isObject, isString } from 'vega-util';

const stringify = (stringify_ as any).default || stringify_;

export const DEFAULT_OPTIONS = {
  /**
   * X offset.
   */
  offsetX: 10,

  /**
   * Y offset.
   */
  offsetY: 10,

  /**
   * ID of the tooltip element.
   */
  id: 'vg-tooltip-element',

  /**
   * ID of the tooltip CSS style.
   */
  styleId: 'vega-tooltip-style',

  /**
   * The name of the theme. You can use the CSS class called [THEME]-theme to style the tooltips.
   *
   * There are two predefined themes: "light" (default) and "dark".
   */
  theme: 'light',

  /**
   * Do not use the default styles provided by Vega Tooltip. If you enable this option, you need to use your own styles. It is not necessary to disable the default style when using a custom theme.
   */
  disableDefaultStyle: false,

  /**
   * HTML sanitizer function that removes dangerous HTML to prevent XSS.
   *
   * This should be a function from string to string. You may replace it with a formatter such as a markdown formatter.
   */
  sanitize: escapeHTML,
};

export type Options = typeof DEFAULT_OPTIONS;

const STYLE = `
.vg-tooltip {
  visibility: hidden;
  padding: 8px;
  position: fixed;
  z-index: 1000;
  font-family: sans-serif;
  font-size: 11px;
  border-radius: 3px;
  box-shadow: 2px 2px 4px rgba(0,0,0,0.1);

  /* The default theme is the light theme. */
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid #d9d9d9;
  color: black;
}
.vg-tooltip.visible {
  visibility: visible;
}
.vg-tooltip h2 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 13px;
}
.vg-tooltip table {
  border-spacing: 0;
}
.vg-tooltip td {
  overflow: hidden;
  text-overflow: ellipsis;
  padding-top: 2px;
  padding-bottom: 2px;
}
.vg-tooltip td.key {
  color: #808080;
  max-width: 150px;
  text-align: right;
  padding-right: 4px;
}
.vg-tooltip td.value {
  max-width: 200px;
  text-align: left;
}

/* Dark and light color themes */
.vg-tooltip.dark-theme {
  background-color: rgba(32, 32, 32, 0.9);
  border: 1px solid #f5f5f5;
  color: white;
}
.vg-tooltip.dark-theme td.key {
  color: #bfbfbf;
}

.vg-tooltip.light-theme {
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid #d9d9d9;
  color: black;
}
.vg-tooltip.light-theme td.key {
  color: #808080;
}
`;

/**
 * Escape special HTML characters.
 *
 * @param value A value to convert to string and HTML-escape.
 */
export function escapeHTML(value: any): string {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

/**
 * The tooltip handler class.
 */
export class Handler {
  /**
   * The handler function. We bind this to this function in the constructor.
   */
  public call: TooltipHandler;

  /**
   * Complete tooltip options.
   */
  private options: Options;

  /**
   * The tooltip html element.
   */
  private el: HTMLElement;

  /**
   * Create the tooltip handler and initialize the element and style.
   *
   * @param options Tooltip Options
   */
  constructor(options?: Partial<Options>) {
    this.options = { ...DEFAULT_OPTIONS, ...options };

    this.call = this.handler.bind(this);

    // append a default stylesheet for tooltips to the head
    if (!this.options.disableDefaultStyle && !document.getElementById(this.options.styleId)) {
      const style = document.createElement('style');
      style.setAttribute('id', this.options.styleId);
      style.innerHTML = STYLE;

      document.querySelector('head')!.appendChild(style);
    }

    // append a div element that we use as a tooltip unless it already exists
    const el = document.getElementById(this.options.id);
    if (el) {
      this.el = el;
    } else {
      this.el = document.createElement('div');
      this.el.setAttribute('id', this.options.id);
      this.el.classList.add('vg-tooltip');

      document.querySelector('body')!.appendChild(this.el);
    }
  }

  /**
   * The handler function.
   */
  private handler(handler: any, event: MouseEvent, item: any, value: any) {
    // console.log(handler, event, item, value);

    if ((event as any).vegaType === undefined) {
      this.el.classList.remove('visible', `${this.options.theme}-theme`);
      return;
    }

    // set the tooltip content
    this.el.innerHTML = this.formatValue(value);

    // make the tooltip visible
    this.el.classList.add('visible', `${this.options.theme}-theme`);

    // position the tooltip
    const tooltipWidth = this.el.getBoundingClientRect().width;
    let x = event.clientX + this.options.offsetX;
    if (x + tooltipWidth > window.innerWidth) {
      x = event.clientX - this.options.offsetX - tooltipWidth;
    }

    const tooltipHeight = this.el.getBoundingClientRect().height;
    let y = event.clientY + this.options.offsetY;
    if (y + tooltipHeight > window.innerHeight) {
      y = +event.clientY - this.options.offsetY - tooltipHeight;
    }

    this.el.setAttribute('style', `top: ${y}px; left: ${x}px`);
  }

  /**
   * Format the value to be shown in the toolip.
   *
   * @param value The value to show in the tooltip.
   */
  private formatValue(value: any): string {
    const sanitize = this.options.sanitize;

    if (isArray(value)) {
      return `[${value.map(v => sanitize(isString(v) ? v : stringify(v))).join(', ')}]`;
    }

    if (isObject(value)) {
      let content = '';

      const { title, ...rest } = value as any;

      if (title) {
        content += `<h2>${title}</h2>`;
      }

      content += '<table>';
      for (const key of Object.keys(rest)) {
        let val = (rest as any)[key];
        if (isObject(val)) {
          val = stringify(val);
        }

        content += `<tr><td class="key">${sanitize(key)}:</td><td class="value">${sanitize(val)}</td></tr>`;
      }
      content += `</table>`;

      return content;
    }

    return sanitize(String(value));
  }

}

/**
 * Create a tooltip handler and register it with the provided view.
 *
 * @param view The Vega view.
 * @param opt Tooltip options.
 */
export default function(view: View, opt?: Partial<Options>) {
  const handler = new Handler(opt);

  view.tooltip(handler.call).hover().run();

  return handler;
}
