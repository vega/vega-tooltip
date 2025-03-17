import {formatValue} from './formatValue.js';
import defaultStyle from './style.js';

const EL_ID = 'vg-tooltip-element';

export type Position = 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface Options {
  /**
   * X offset.
   */
  offsetX?: number;

  /**
   * Y offset.
   */
  offsetY?: number;

  /**
   * ID of the tooltip element.
   */
  id?: string;

  /**
   * ID of the tooltip CSS style.
   */
  styleId?: string;

  /**
   * The name of the theme. You can use the CSS class called [THEME]-theme to style the tooltips.
   *
   * There are two predefined themes: "light" (default) and "dark".
   */
  theme?: string;

  /**
   * Do not use the default styles provided by Vega Tooltip. If you enable this option, you need to use your own styles. It is not necessary to disable the default style when using a custom theme.
   */
  disableDefaultStyle?: boolean;

  /**
   * HTML sanitizer function that removes dangerous HTML to prevent XSS.
   *
   * This should be a function from string to string. You may replace it with a formatter such as a markdown formatter.
   */
  sanitize?: (value: any) => string;

  /**
   * The maximum recursion depth when printing objects in the tooltip.
   */
  maxDepth?: number;

  /**
   * A function to customize the rendered HTML of the tooltip.
   * @param value A value string, or object of value strings keyed by field
   * @param sanitize The `sanitize` function from `options.sanitize`
   * @param baseURL The `baseURL` from `options.baseURL`
   * @returns {string} The returned string will become the `innerHTML` of the tooltip element
   */
  formatTooltip?: (value: any, valueToHtml: (value: any) => string, maxDepth: number, baseURL: string) => string;

  /**
   * The baseurl to use in image paths.
   */
  baseURL?: string;

  /**
   * The snap reference for the tooltip.
   */
  anchor?: 'cursor' | 'mark';

  /**
   * The position of the tooltip relative to the anchor.
   *
   * Only valid when `anchor` is set to 'mark'.
   */
  position?: Position | Position[];
}

export const DEFAULT_OPTIONS: Required<Options> = {
  offsetX: 10,
  offsetY: 10,
  id: EL_ID,
  styleId: 'vega-tooltip-style',
  theme: 'light',
  disableDefaultStyle: false,
  sanitize: escapeHTML,
  maxDepth: 2,
  formatTooltip: formatValue,
  baseURL: '',
  anchor: 'cursor',
  position: ['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'],
};

/**
 * Escape special HTML characters.
 *
 * @param value A value to convert to string and HTML-escape.
 */
export function escapeHTML(value: any): string {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

export function createDefaultStyle(id: string): string {
  // Just in case this id comes from a user, ensure these is no security issues
  if (!/^[A-Za-z]+[-:.\w]*$/.test(id)) {
    throw new Error('Invalid HTML ID');
  }

  return defaultStyle.toString().replaceAll(EL_ID, id);
}
