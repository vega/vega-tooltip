import {TooltipHandler} from 'vega-typings';

import {createDefaultStyle, DEFAULT_OPTIONS, Options} from './defaults.js';
import {calculatePositionRelativeToCursor, calculatePositionRelativeToMark} from './position.js';

/**
 * The default stylesheets adopted by the document, keyed by `styleId`.
 */
const adoptedStyles = new Map<string, CSSStyleSheet>();

/**
 * Adopt the default styles once per `styleId`. A new `CSSStyleSheet` is not blocked by CSP, and
 * the `vega-tooltip` cascade layer lets unlayered page styles override it.
 */
function addDefaultStyle(styleId: string, css: string) {
  const existing = adoptedStyles.get(styleId);
  if (existing && document.adoptedStyleSheets.includes(existing)) {
    return;
  }

  const sheet = new CSSStyleSheet();
  sheet.replaceSync(`@layer vega-tooltip {\n${css}}\n`);
  adoptedStyles.set(styleId, sheet);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
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
  private options: Required<Options>;

  /**
   * The tooltip html element.
   */
  private el: HTMLElement | null;

  /**
   * Create the tooltip handler and initialize the element and style.
   *
   * @param options Tooltip Options
   */
  constructor(options?: Options) {
    this.options = {...DEFAULT_OPTIONS, ...options};
    const elementId = this.options.id;
    this.el = null;

    // bind this to call
    this.call = this.tooltipHandler.bind(this);

    if (!this.options.disableDefaultStyle) {
      addDefaultStyle(this.options.styleId, createDefaultStyle(elementId));
    }
  }

  /**
   * The tooltip handler function.
   */
  private tooltipHandler(handler: any, event: MouseEvent, item: any, value: any) {
    // append a div element that we use as a tooltip unless it already exists
    this.el = document.getElementById(this.options.id);
    if (!this.el) {
      this.el = document.createElement('div');
      this.el.setAttribute('id', this.options.id);
      this.el.classList.add('vg-tooltip');

      const tooltipContainer = document.fullscreenElement ?? document.body;
      tooltipContainer.appendChild(this.el);
    }

    // hide tooltip for null, undefined, or empty string values
    if (value == null || value === '') {
      this.el.classList.remove('visible', `${this.options.theme}-theme`);
      return;
    }

    // set the tooltip content
    this.el.innerHTML = this.options.formatTooltip(
      value,
      this.options.sanitize,
      this.options.maxDepth,
      this.options.baseURL,
    );

    // make the tooltip visible
    this.el.classList.add('visible', `${this.options.theme}-theme`);

    const {x, y} =
      this.options.anchor === 'mark'
        ? calculatePositionRelativeToMark(handler, event, item, this.el.getBoundingClientRect(), this.options)
        : calculatePositionRelativeToCursor(event, this.el.getBoundingClientRect(), this.options);

    this.el.style.top = `${y}px`;
    this.el.style.left = `${x}px`;
  }
}
