export declare const DEFAULT_OPTIONS: {
    offsetX: number;
    offsetY: number;
    id: string;
    styleId: string;
    theme: string;
    disableDefaultStyle: boolean;
    sanitize: typeof escapeHTML;
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
