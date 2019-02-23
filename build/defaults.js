import defaultStyle from './style';
const EL_ID = 'vg-tooltip-element';
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
    id: EL_ID,
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
    maxDepth: 2
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
    return defaultStyle.toString().replace(EL_ID, id);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZGVmYXVsdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxZQUFZLE1BQU0sU0FBUyxDQUFDO0FBRW5DLE1BQU0sS0FBSyxHQUFHLG9CQUFvQixDQUFDO0FBRW5DLE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRztJQUM3Qjs7T0FFRztJQUNILE9BQU8sRUFBRSxFQUFFO0lBRVg7O09BRUc7SUFDSCxPQUFPLEVBQUUsRUFBRTtJQUVYOztPQUVHO0lBQ0gsRUFBRSxFQUFFLEtBQUs7SUFFVDs7T0FFRztJQUNILE9BQU8sRUFBRSxvQkFBb0I7SUFFN0I7Ozs7T0FJRztJQUNILEtBQUssRUFBRSxPQUFPO0lBRWQ7O09BRUc7SUFDSCxtQkFBbUIsRUFBRSxLQUFLO0lBRTFCOzs7O09BSUc7SUFDSCxRQUFRLEVBQUUsVUFBVTtJQUVwQjs7T0FFRztJQUNILFFBQVEsRUFBRSxDQUFDO0NBQ1osQ0FBQztBQUlGOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsVUFBVSxDQUFDLEtBQVU7SUFDbkMsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO1NBQ2pCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDO1NBQ3RCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDM0IsQ0FBQztBQUVELE1BQU0sVUFBVSxrQkFBa0IsQ0FBQyxFQUFVO0lBQzNDLDZFQUE2RTtJQUM3RSxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztLQUNwQztJQUVELE9BQU8sWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDcEQsQ0FBQyJ9