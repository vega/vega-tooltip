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

  /**
   * The maximum recursion depth when printing objects in the tooltip.
   */
  maxDepth: 2,
};

export type Options = typeof DEFAULT_OPTIONS;

/**
 * Escape special HTML characters.
 *
 * @param value A value to convert to string and HTML-escape.
 */
export function escapeHTML(value: any): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;');
}

export function createDefaultStyle(id: string): string {
  // Just in case this id comes from a user, ensure these is no security issues
  if (!/^[A-Za-z]+[-:.\w]*$/.test(id)) {
    throw new Error('Invalid HTML ID');
  }

  return `
#${id} {
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
#${id}.visible {
  visibility: visible;
}
#${id} h2 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 13px;
}
#${id} table {
  border-spacing: 0;
}
#${id} td {
  overflow: hidden;
  text-overflow: ellipsis;
  padding-top: 2px;
  padding-bottom: 2px;
}
#${id} td.key {
  color: #808080;
  max-width: 150px;
  text-align: right;
  padding-right: 4px;
}
#${id} td.value {
  display: block;
  max-width: 300px;
  max-height: 7em;
  text-align: left;
}

/* Dark and light color themes */
#${id}.dark-theme {
  background-color: rgba(32, 32, 32, 0.9);
  border: 1px solid #f5f5f5;
  color: white;
}
#${id}.dark-theme td.key {
  color: #bfbfbf;
}

#${id}.light-theme {
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid #d9d9d9;
  color: black;
}
#${id}.light-theme td.key {
  color: #808080;
}
`;
}
