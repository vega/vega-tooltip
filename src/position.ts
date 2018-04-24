/**
 * Position the tooltip
 * @param {MouseEvent} event
 * @param tooltipBox
 * @param offsetX
 * @param offsetY
 * @returns {{x: number; y: number}}
 */
export function calculatePosition(
  event: MouseEvent,
  tooltipBox: { width: number; height: number },
  offsetX: number,
  offsetY: number
) {
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
