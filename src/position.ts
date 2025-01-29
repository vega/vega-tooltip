import {Bounds} from 'vega-typings';
import {Options, Position} from './defaults.js';

type MarkBounds = Pick<Bounds, 'x1' | 'x2' | 'y1' | 'y2'>;

/**
 * Position the tooltip
 *
 * @param event The mouse event.
 * @param tooltipBox
 * @param options Tooltip handler options.
 */
export function calculatePositionRelativeToCursor(
  event: MouseEvent,
  tooltipBox: {width: number; height: number},
  {offsetX, offsetY}: Required<Options>,
) {
  // the possible positions for the tooltip
  const positions = getPositions(
    {x1: event.clientX, x2: event.clientX, y1: event.clientY, y2: event.clientY},
    tooltipBox,
    offsetX,
    offsetY,
  );

  // order of positions to try
  const postionArr: Position[] = ['bottom-right', 'bottom-left', 'top-right', 'top-left'];

  // test positions till a valid one is found
  for (const p of postionArr) {
    if (tooltipIsInViewport(positions[p], tooltipBox)) {
      return positions[p];
    }
  }

  // default to top-left if a valid position is not found
  // this is legacy behavior
  return positions['top-left'];
}

/**
 * Calculates the position of the tooltip relative to the mark.
 * @param handler The handler instance.
 * @param event The mouse event.
 * @param item The item that the tooltip is being shown for.
 * @param tooltipBox Client rect of the tooltip element.
 * @param options Tooltip handler options.
 * @returns
 */
export function calculatePositionRelativeToMark(
  handler: any,
  event: MouseEvent,
  item: any,
  tooltipBox: {width: number; height: number},
  options: Required<Options>,
) {
  const {position, offsetX, offsetY} = options;
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
    if (tooltipIsInViewport(positions[p], tooltipBox) && !mouseIsOnTooltip(event, positions[p], tooltipBox)) {
      return positions[p];
    }
  }

  // default to cursor position if a valid position is not found
  return calculatePositionRelativeToCursor(event, tooltipBox, options);
}

// Calculates the bounds of the mark relative to the viewport.
export function getMarkBounds(
  containerBox: {left: number; top: number},
  origin: [number, number],
  item: any,
): MarkBounds {
  // if this is a voronoi mark, we want to use the bounds of the point that voronoi cell represents
  const markBounds = item.isVoronoi ? item.datum.bounds : item.bounds;

  let left = containerBox.left + origin[0] + markBounds.x1;
  let top = containerBox.top + origin[1] + markBounds.y1;

  // traverse mark groups, summing their offsets to get the total offset
  // item bounds are relative to their group so if there are multiple nested groups we need to add them all
  let parentItem = item;
  while (parentItem.mark.group) {
    parentItem = parentItem.mark.group;
    left += parentItem.x ?? 0;
    top += parentItem.y ?? 0;
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

// Calculates the tooltip xy for each possible position.
export function getPositions(
  markBounds: MarkBounds,
  tooltipBox: {width: number; height: number},
  offsetX: number,
  offsetY: number,
) {
  const xc = (markBounds.x1 + markBounds.x2) / 2;
  const yc = (markBounds.y1 + markBounds.y2) / 2;

  // x positions
  const left = markBounds.x1 - tooltipBox.width - offsetX;
  const center = xc - tooltipBox.width / 2;
  const right = markBounds.x2 + offsetX;

  // y positions
  const top = markBounds.y1 - tooltipBox.height - offsetY;
  const middle = yc - tooltipBox.height / 2;
  const bottom = markBounds.y2 + offsetY;

  const positions: Record<Position, {x: number; y: number}> = {
    top: {x: center, y: top},
    bottom: {x: center, y: bottom},
    left: {x: left, y: middle},
    right: {x: right, y: middle},
    'top-left': {x: left, y: top},
    'top-right': {x: right, y: top},
    'bottom-left': {x: left, y: bottom},
    'bottom-right': {x: right, y: bottom},
  };
  return positions;
}

// Checks if the tooltip would be in the viewport at the given position
export function tooltipIsInViewport(position: {x: number; y: number}, tooltipBox: {width: number; height: number}) {
  return (
    position.x >= 0 &&
    position.y >= 0 &&
    position.x + tooltipBox.width <= window.innerWidth &&
    position.y + tooltipBox.height <= window.innerHeight
  );
}

// Checks if the mouse is within the tooltip area
export function mouseIsOnTooltip(
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
