export var DEFAULT_OPTIONS = {
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
/**
 * Escape special HTML characters.
 *
 * @param value A value to convert to string and HTML-escape.
 */
export function escapeHTML(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;');
}
export function createDefaultStyle(id) {
    // Just in case this id comes from a user, ensure these is no security issues
    if (!/^[A-Za-z]+[-:.\w]*$/.test(id)) {
        throw new Error('Invalid HTML ID');
    }
    return "\n#" + id + " {\n  visibility: hidden;\n  padding: 8px;\n  position: fixed;\n  z-index: 1000;\n  font-family: sans-serif;\n  font-size: 11px;\n  border-radius: 3px;\n  box-shadow: 2px 2px 4px rgba(0,0,0,0.1);\n\n  /* The default theme is the light theme. */\n  background-color: rgba(255, 255, 255, 0.95);\n  border: 1px solid #d9d9d9;\n  color: black;\n}\n#" + id + ".visible {\n  visibility: visible;\n}\n#" + id + " h2 {\n  margin-top: 0;\n  margin-bottom: 10px;\n  font-size: 13px;\n}\n#" + id + " table {\n  border-spacing: 0;\n}\n#" + id + " td {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  padding-top: 2px;\n  padding-bottom: 2px;\n}\n#" + id + " td.key {\n  color: #808080;\n  max-width: 150px;\n  text-align: right;\n  padding-right: 4px;\n}\n#" + id + " td.value {\n  display: block;\n  max-width: 300px;\n  max-height: 7em;\n  text-align: left;\n}\n\n/* Dark and light color themes */\n#" + id + ".dark-theme {\n  background-color: rgba(32, 32, 32, 0.9);\n  border: 1px solid #f5f5f5;\n  color: white;\n}\n#" + id + ".dark-theme td.key {\n  color: #bfbfbf;\n}\n\n#" + id + ".light-theme {\n  background-color: rgba(255, 255, 255, 0.95);\n  border: 1px solid #d9d9d9;\n  color: black;\n}\n#" + id + ".light-theme td.key {\n  color: #808080;\n}\n";
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZGVmYXVsdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLElBQU0sZUFBZSxHQUFHO0lBQzdCOztPQUVHO0lBQ0gsT0FBTyxFQUFFLEVBQUU7SUFFWDs7T0FFRztJQUNILE9BQU8sRUFBRSxFQUFFO0lBRVg7O09BRUc7SUFDSCxFQUFFLEVBQUUsb0JBQW9CO0lBRXhCOztPQUVHO0lBQ0gsT0FBTyxFQUFFLG9CQUFvQjtJQUU3Qjs7OztPQUlHO0lBQ0gsS0FBSyxFQUFFLE9BQU87SUFFZDs7T0FFRztJQUNILG1CQUFtQixFQUFFLEtBQUs7SUFFMUI7Ozs7T0FJRztJQUNILFFBQVEsRUFBRSxVQUFVO0lBRXBCOztPQUVHO0lBQ0gsUUFBUSxFQUFFLENBQUM7Q0FDWixDQUFDO0FBSUY7Ozs7R0FJRztBQUNILE1BQU0scUJBQXFCLEtBQVU7SUFDbkMsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO1NBQ2pCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDO1NBQ3RCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDM0IsQ0FBQztBQUVELE1BQU0sNkJBQTZCLEVBQVU7SUFDM0MsNkVBQTZFO0lBQzdFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0tBQ3BDO0lBRUQsT0FBTyxRQUNOLEVBQUUsaVdBZUYsRUFBRSxnREFHRixFQUFFLGlGQUtGLEVBQUUsNENBR0YsRUFBRSxpSEFNRixFQUFFLDRHQU1GLEVBQUUsK0lBUUYsRUFBRSxzSEFLRixFQUFFLHVEQUlGLEVBQUUsMkhBS0YsRUFBRSxrREFHSixDQUFDO0FBQ0YsQ0FBQyJ9