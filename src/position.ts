/**
 * Position the tooltip
 *
 * @param event The mouse event.
 * @param tooltipBox
 * @param offsetX Horizontal offset.
 * @param offsetY Vertical offset.
 */
export function calculatePosition(
  event: MouseEvent,
  tooltipBox: { width: number; height: number },
  offsetX: number,
  offsetY: number
) {
  let x = event.pageX + offsetX;
  if (x + tooltipBox.width > window.innerWidth) {
    x = +event.pageX - offsetX - tooltipBox.width;
  }

  let y = event.pageY + offsetY;
  if (y + tooltipBox.height > window.innerHeight) {
    y = +event.pageY - offsetY - tooltipBox.height;
  }

  return { x, y };
}
