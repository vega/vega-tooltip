/**
 * Position the tooltip
 *
 * @param event The mouse event.
 * @param tooltipBox
 * @param offsetX Horizontal offset.
 * @param offsetY Vertical offset.
 */
export declare function calculatePosition(event: MouseEvent, tooltipBox: {
    width: number;
    height: number;
}, offsetX: number, offsetY: number): {
    x: number;
    y: number;
};
