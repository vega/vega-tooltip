import * as stringify_ from 'json-stringify-pretty-compact';
import { Item, ScenegraphEvent, View } from 'vega-typings';
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
   * If of the tooltip element.
   */
  id: 'vg-tooltip-element',

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

const STYLE_ID = 'vega-tooltip-style';

/**
 * The tooltip html element.
 */
let tooltipElement: HTMLElement;

function escapeValue(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Initialize the tooltip element and style.
 *
 * @param options Tooltip options.
 */
function init(options: Options) {
  if (document.getElementById(options.id)) {
    // no need to initialize multiple times
    return;
  }

  // append a default stylesheet for tooltips to the head
  if (!options.disableDefaultStyle && !document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.setAttribute('id', STYLE_ID);
    style.innerHTML = STYLE;
    document.querySelector('head')!.appendChild(style);
  }

  tooltipElement = document.createElement('div');
  tooltipElement.setAttribute('id', options.id);
  tooltipElement.classList.add('vg-tooltip');

  document.querySelector('body')!.appendChild(tooltipElement);
}

/**
 * Format the value to be shown in the toolip.
 *
 * @param value The value to show in the tooltip.
 */
function formatValue(value: any): string {
  if (isArray(value)) {
    return `[${value.map(v => (isString(v) ? v : stringify(v))).join(', ')}]`;
  }

  if (isString(value)) {
    return value;
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

      content += `<tr><td class="key">${escapeValue(key)}:</td><td class="value">${escapeValue(val)}</td></tr>`;
    }
    content += `</table>`;

    return content;
  }

  return `${value}`;
}

/**
 * Attach a tooltip handler to the view.
 */
export default function(view: View, opt?: Options) {
  let visible = false;

  const options = { ...DEFAULT_OPTIONS, ...opt };

  init(options);

  function hideTooltip() {
    tooltipElement.classList.remove('visible', `${options.theme}-theme`);
    visible = false;
  }

  function tooltipHandler(this: View, handler: any, event: MouseEvent, item: any, value: any) {
    // console.log(this, handler, event, item, value);

    if ((event as any).vegaType === undefined) {
      hideTooltip();
      return;
    }

    tooltipElement.innerHTML = formatValue(value);

    tooltipElement.classList.add('visible', `${options.theme}-theme`);
    visible = true;
  }

  function handleMouseMove(event: ScenegraphEvent, item?: Item) {
    if (!visible) {
      return;
    }

    if (!isMouseMoveEvent(event)) {
      return;
    }

    const tooltipWidth = tooltipElement.getBoundingClientRect().width;
    let x = event.clientX + options.offsetX;
    if (x + tooltipWidth > window.innerWidth) {
      x = event.clientX - options.offsetX - tooltipWidth;
    }

    const tooltipHeight = tooltipElement.getBoundingClientRect().height;
    let y = event.clientY + options.offsetY;
    if (y + tooltipHeight > window.innerHeight) {
      y = +event.clientY - options.offsetY - tooltipHeight;
    }

    tooltipElement.setAttribute('style', `top: ${y}px; left: ${x}px`);
  }

  view.addEventListener('mousemove', handleMouseMove);

  // Set tooltip handler;
  view.tooltip(tooltipHandler);

  return {
    destroy: () => {
      view.removeEventListener('mousemove', handleMouseMove);
    },
  };
}

function isMouseMoveEvent(event: ScenegraphEvent): event is MouseEvent {
  return event.type === 'mousemove';
}
