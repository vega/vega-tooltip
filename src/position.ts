import {Bounds} from 'vega-typings';
import {Options, Position} from './defaults';

type MarkBounds = Pick<Bounds, 'x1' | 'x2' | 'y1' | 'y2'>;

/**
 * Position the tooltip
 *
 * @param event The mouse event.
 * @param tooltipBox
 * @param offsetX Horizontal offset.
 * @param offsetY Vertical offset.
 */
export function calculatePositionRelativeToCursor(
  event: MouseEvent,
  tooltipBox: {width: number; height: number},
  offsetX: number,
  offsetY: number,
) {
  let x = event.clientX + offsetX;
  if (x + tooltipBox.width > window.innerWidth) {
    x = +event.clientX - offsetX - tooltipBox.width;
  }

  let y = event.clientY + offsetY;
  if (y + tooltipBox.height > window.innerHeight) {
    y = +event.clientY - offsetY - tooltipBox.height;
  }

  return {x, y};
}

/**
 * calculates the position of the tooltip relative to the mark
 * @param event The mouse event.
 * @param containerBox The bounding box of the container relative to the viewport.
 * @param origin The origin of the chart area.
 * @param item The item that the tooltip is being shown for.
 * @param tooltipBox The bounding box of the tooltip.
 * @param position The position of the tooltip relative to the mark.
 * @param offset The offset from the mark.
 * @returns
 */
export function calculatePositionRelativeToMark(
  handler: any,
  event: MouseEvent,
  item: any,
  tooltipBox: {width: number; height: number},
  {position, offsetX, offsetY}: Required<Options>,
) {
  const containerBox = handler._el.getBoundingClientRect();
  const origin = handler._origin;

  // bounds of the mark relative to the viewport
  const markBounds = getMarkBounds(containerBox, origin, item);

  // the possible positions for the tooltip
  const positions = getPositions(markBounds, tooltipBox, offsetX, offsetY);

  // positions to test
  const positionArr = Array.isArray(position) ? position : [position];

  // test positions till a valid one is found
  for (const p of positionArr) {
    // verify that the tooltip is in the view and the mouse is not where the tooltip would be
    if (isInView(positions[p], tooltipBox) && !mouseIsOnTooltip(event, positions[p], tooltipBox)) {
      return positions[p];
    }
  }

  // default to cursor position if a valid position is not found
  return calculatePositionRelativeToCursor(event, tooltipBox, offsetX, offsetY);
}

// Calculates the bounds of the mark relative to the viewport
function getMarkBounds(containerBox: {left: number; top: number}, origin: [number, number], item: any): MarkBounds {
  // if this is a voronoi mark, we want to use the bounds of the point that voronoi cell represents
  const markBounds = item.isVoronoi ? item.datum.bounds : item.bounds;

  let left = containerBox.left + origin[0] + markBounds.x1;
  let top = containerBox.top + origin[1] + markBounds.y1;

  // traverse mark groups, summing their offsets to get the total offset
  // item bounds are relative to their group so if there are multiple nested groups we need to add them all
  let parentItem = item;
  while (parentItem.mark.group) {
    parentItem = parentItem.mark.group;
    if ('x' in parentItem && 'y' in parentItem) {
      left += parentItem.x;
      top += parentItem.y;
    }
  }

  const markWidth = markBounds.x2 - markBounds.x1;
  const markHeight = markBounds.y2 - markBounds.y1;

  return {
    x1: left,
    x2: left + markWidth,
    y1: top,
    y2: top + markHeight,
  };
}

// calculates the tooltip xy for each possible position
//update to handle offsetX and offsetY
function getPositions(
  anchorBounds: MarkBounds,
  tooltipBox: {width: number; height: number},
  offsetX: number,
  offsetY: number,
) {

  const xc = (anchorBounds.x1 + anchorBounds.x2) / 2;
  const yc = (anchorBounds.y1 + anchorBounds.y2) / 2;

  const yPositions = {
    top: anchorBounds.y1 - tooltipBox.height,
    middle: yc - tooltipBox.height / 2,
    bottom: anchorBounds.y2,
  };

  const xPositions = {
    left: anchorBounds.x1 - tooltipBox.width,
    center: xc - tooltipBox.width / 2,
    right: anchorBounds.x2,
  };

  const positions: Record<Position, {x: number; y: number}> = {
    top: {x: xPositions.center, y: yPositions.top - offsetY},
    bottom: {x: xPositions.center, y: yPositions.bottom + offsetY},
    left: {x: xPositions.left - offsetX, y: yPositions.middle},
    right: {x: xPositions.right + offsetX, y: yPositions.middle},
    'top-left': {x: xPositions.left - offsetX, y: yPositions.top - offsetY},
    'top-right': {x: xPositions.right + offsetX, y: yPositions.top - offsetY},
    'bottom-left': {x: xPositions.left - offsetX, y: yPositions.bottom + offsetY},
    'bottom-right': {x: xPositions.right + offsetX, y: yPositions.bottom + offsetY},
  };
  return positions;
}

// Checks if the tooltip would be in view at the given position
function isInView(position: {x: number; y: number}, tooltipBox: {width: number; height: number}) {
  return (
    position.x >= 0 &&
    position.y >= 0 &&
    position.x + tooltipBox.width <= window.innerWidth &&
    position.y + tooltipBox.height <= window.innerHeight
  );
}

// Checks if the mouse is within the tooltip area
function mouseIsOnTooltip(
  event: MouseEvent,
  position: {x: number; y: number},
  tooltipBox: {width: number; height: number},
) {
  return (
    event.clientX >= position.x &&
    event.clientX <= position.x + tooltipBox.width &&
    event.clientY >= position.y &&
    event.clientY <= position.y + tooltipBox.height
  );
}
