/**
 * Position the tooltip
 *
 * @param event The mouse event.
 * @param tooltipBox
 * @param offsetX Horizontal offset.
 * @param offsetY Vertical offset.
 */
export function calculatePosition(event, tooltipBox, offsetX, offsetY) {
    let x = event.clientX + offsetX;
    if (x + tooltipBox.width > window.innerWidth) {
        x = +event.clientX - offsetX - tooltipBox.width;
    }
    let y = event.clientY + offsetY;
    if (y + tooltipBox.height > window.innerHeight) {
        y = +event.clientY - offsetY - tooltipBox.height;
    }
    return { x, y };
}
//# sourceMappingURL=position.js.map