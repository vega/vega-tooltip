import {Position} from './defaults';

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

export function calculatePositionRelativeToItem(
  event: MouseEvent,
  containerBox: {left: number; top: number},
  origin: [number, number],
  item: any,
  tooltipBox: {width: number; height: number},
  position: Position | Position[],
  offset: number = 5,
) {
  // if this is a voronoi mark, we want to use the bounds of the point that drew the vornoi cell
  const markBounds = item.isVoronoi ? item.datum.bounds : item.bounds;
  let left = containerBox.left + origin[0] + markBounds.x1;
  let top = containerBox.top + origin[1] + markBounds.y1;

  let parentItem = item;

  while (parentItem.mark.group) {
    parentItem = parentItem.mark.group;
    if ('x' in parentItem && 'y' in parentItem) {
      left += parentItem.x;
      top += parentItem.y;
    }
  }

  const width = markBounds.x2 - markBounds.x1;
  const height = markBounds.y2 - markBounds.y1;

  const anchorBounds = {
    x1: left,
    x2: left + width,
    y1: top,
    y2: top + height,
  };
  const diagnalOffset = offset / Math.sqrt(2);
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
    top: {x: xPositions.center, y: yPositions.top - offset},
    bottom: {x: xPositions.center, y: yPositions.bottom + offset},
    left: {x: xPositions.left - offset, y: yPositions.middle},
    right: {x: xPositions.right + offset, y: yPositions.middle},
    'top-left': {x: xPositions.left - diagnalOffset, y: yPositions.top - diagnalOffset},
    'top-right': {x: xPositions.right + diagnalOffset, y: yPositions.top - diagnalOffset},
    'bottom-left': {x: xPositions.left - diagnalOffset, y: yPositions.bottom + diagnalOffset},
    'bottom-right': {x: xPositions.right + diagnalOffset, y: yPositions.bottom + diagnalOffset},
  };

  // order to attempt positioning the tooltip
  let positionOrder: Position[] = [
    'top',
    'bottom',
    'left',
    'right',
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
  ];

  if (Array.isArray(position)) {
    positionOrder = position;
  } else {
    positionOrder.unshift(position);
  }

  for (const p of positionOrder) {
    // verify that the tooltip is in the view and the mouse is not where the tooltip would be
    if (isInView(positions[p], tooltipBox) && !mouseIsOnTooltip(event, positions[p], tooltipBox)) {
      return positions[p];
    }
  }

  // default to the first position
  return positions[positionOrder[0]];
}

function isInView(position: {x: number; y: number}, tooltipBox: {width: number; height: number}) {
  return (
    position.x >= 0 &&
    position.y >= 0 &&
    position.x + tooltipBox.width <= window.innerWidth &&
    position.y + tooltipBox.height <= window.innerHeight
  );
}

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
