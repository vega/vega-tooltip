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
  tooltipBox: { width: number, height: number },
  offsetX: number,
  offsetY: number
) {
  const tooltipWidth = tooltipBox.width;
  let x = event.clientX + offsetX;
  if (x + tooltipWidth > window.innerWidth) {
    x = +event.clientX - offsetX - tooltipWidth;
  }

  const tooltipHeight = tooltipBox.height;
  let y = event.clientY + offsetY;
  if (y + tooltipHeight > window.innerHeight) {
    y = +event.clientY - offsetY - tooltipHeight;
  }

  return {x, y};
}
