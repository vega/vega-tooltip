export declare const DEFAULT_OPTIONS: {
    /**
     * X offset.
     */
    offsetX: number;
    /**
     * Y offset.
     */
    offsetY: number;
    /**
     * ID of the tooltip element.
     */
    id: string;
    /**
     * ID of the tooltip CSS style.
     */
    styleId: string;
    /**
     * The name of the theme. You can use the CSS class called [THEME]-theme to style the tooltips.
     *
     * There are two predefined themes: "light" (default) and "dark".
     */
    theme: string;
    /**
     * Do not use the default styles provided by Vega Tooltip. If you enable this option, you need to use your own styles. It is not necessary to disable the default style when using a custom theme.
     */
    disableDefaultStyle: boolean;
    /**
     * HTML sanitizer function that removes dangerous HTML to prevent XSS.
     *
     * This should be a function from string to string. You may replace it with a formatter such as a markdown formatter.
     */
    sanitize: typeof escapeHTML;
    /**
     * The maximum recursion depth when printing objects in the tooltip.
     */
    maxDepth: number;
};
export declare type Options = typeof DEFAULT_OPTIONS;
/**
 * Escape special HTML characters.
 *
 * @param value A value to convert to string and HTML-escape.
 */
export declare function escapeHTML(value: any): string;
export declare function createDefaultStyle(id: string): string;
