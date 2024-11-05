import {
  calculatePositionRelativeToCursor,
  calculatePositionRelativeToMark,
  DEFAULT_OPTIONS,
  getMarkBounds,
  getPositions,
  mouseIsOnTooltip,
  tooltipIsInViewport,
} from '../src';

global.window = Object.create({});
Object.defineProperty(window, 'innerWidth', {value: 500});
Object.defineProperty(window, 'innerHeight', {value: 500});

const defaultTooltipBox = {width: 100, height: 100};
const defaultMouseEvent = {clientX: 100, clientY: 100} as MouseEvent;

const defaultItem = {
  isVoronoi: false,
  bounds: {x1: 150, x2: 200, y1: 75, y2: 125},
  mark: {},
};

describe('calculatePositionRelativeToCursor()', () => {
  test('should return position in bottom right corner of cursor if there is enough space', () => {
    const position = calculatePositionRelativeToCursor(defaultMouseEvent, defaultTooltipBox, DEFAULT_OPTIONS);
    expect(position).toEqual({x: 110, y: 110});
  });
  test('should return position in top right corner of cursor if there is not space below', () => {
    const position = calculatePositionRelativeToCursor(
      {...defaultMouseEvent, clientY: 480},
      defaultTooltipBox,
      DEFAULT_OPTIONS,
    );
    expect(position).toEqual({x: 110, y: 370});
  });
  test('should return position in bottom left corner of cursor if there is not space to the right', () => {
    const position = calculatePositionRelativeToCursor(
      {...defaultMouseEvent, clientX: 480},
      defaultTooltipBox,
      DEFAULT_OPTIONS,
    );
    expect(position).toEqual({x: 370, y: 110});
  });
  test('should return position in top left corner of cursor if there is not space below and to the right', () => {
    const position = calculatePositionRelativeToCursor(
      {...defaultMouseEvent, clientX: 480, clientY: 480},
      defaultTooltipBox,
      DEFAULT_OPTIONS,
    );
    expect(position).toEqual({x: 370, y: 370});
  });
});

describe('calculatePositionRelativeToMark()', () => {
  const handler = {_el: {getBoundingClientRect: () => ({left: 100, top: 100})}, _origin: [0, 0]};
  test('should return position on top if there is enough space', () => {
    const position = calculatePositionRelativeToMark(
      handler,
      defaultMouseEvent,
      defaultItem,
      defaultTooltipBox,
      DEFAULT_OPTIONS,
    );
    expect(position).toEqual({x: 225, y: 65});
  });
  test('should use mouse position if there is not room in the viewport for available options', () => {
    const position = calculatePositionRelativeToMark(
      handler,
      defaultMouseEvent,
      {...defaultItem, bounds: {x1: 0, x2: 400, y1: 0, y2: 400}},
      {width: 200, height: 200},
      DEFAULT_OPTIONS,
    );
    expect(position).toEqual({x: 110, y: 110});
  });
});

describe('getMarkBounds()', () => {
  test('should return the bounds of the mark', () => {
    expect(getMarkBounds({left: 100, top: 100}, [0, 0], defaultItem)).toEqual({x1: 250, x2: 300, y1: 175, y2: 225});
    expect(getMarkBounds({left: 150, top: 100}, [0, 0], defaultItem)).toEqual({x1: 300, x2: 350, y1: 175, y2: 225});
    expect(getMarkBounds({left: 100, top: 150}, [0, 0], defaultItem)).toEqual({x1: 250, x2: 300, y1: 225, y2: 275});
    expect(getMarkBounds({left: 100, top: 100}, [10, 0], defaultItem)).toEqual({x1: 260, x2: 310, y1: 175, y2: 225});
    expect(getMarkBounds({left: 100, top: 100}, [0, 10], defaultItem)).toEqual({x1: 250, x2: 300, y1: 185, y2: 235});
  });
  test('should use the bounds of the voronoi mark if it is a voronoi mark', () => {
    const item = {
      ...defaultItem,
      datum: {bounds: {x1: 35, x2: 45, y1: 55, y2: 65}},
    };
    expect(getMarkBounds({left: 100, top: 100}, [0, 0], {...item, isVoronoi: true})).toEqual({
      x1: 135,
      x2: 145,
      y1: 155,
      y2: 165,
    });
    expect(getMarkBounds({left: 100, top: 100}, [0, 0], {...item, isVoronoi: false})).toEqual({
      x1: 250,
      x2: 300,
      y1: 175,
      y2: 225,
    });
  });
  test('should sum the offsets of parent groups', () => {
    const item = {...defaultItem, mark: {group: {x: 10, y: 20, mark: {group: {x: 30, y: 40, mark: {}}}}}};
    expect(getMarkBounds({left: 0, top: 0}, [0, 0], defaultItem)).toEqual({x1: 150, x2: 200, y1: 75, y2: 125});
    expect(getMarkBounds({left: 0, top: 0}, [0, 0], item)).toEqual({x1: 190, x2: 240, y1: 135, y2: 185});
  });
});

describe('getPositions()', () => {
  test('should calculate all the possible positions for the tooltip', () => {
    const markBounds = {x1: 0, x2: 50, y1: 0, y2: 50};
    const tooltipBox = {width: 200, height: 100};

    const positions = getPositions(markBounds, tooltipBox, 10, 10);

    expect(positions).toHaveProperty('top', {x: -75, y: -110});
    expect(positions).toHaveProperty('bottom', {x: -75, y: 60});
    expect(positions).toHaveProperty('left', {x: -210, y: -25});
    expect(positions).toHaveProperty('right', {x: 60, y: -25});
    expect(positions).toHaveProperty('top-left', {x: -210, y: -110});
    expect(positions).toHaveProperty('top-right', {x: 60, y: -110});
    expect(positions).toHaveProperty('bottom-left', {x: -210, y: 60});
    expect(positions).toHaveProperty('bottom-right', {x: 60, y: 60});
  });
});

describe('tooltipIsInViewport()', () => {
  const tooltipBox = {width: 100, height: 100};
  test('should return true if the tooltip is in the viewport', () => {
    expect(tooltipIsInViewport({x: 0, y: 0}, tooltipBox)).toBe(true);
    expect(tooltipIsInViewport({x: 400, y: 400}, tooltipBox)).toBe(true);
    expect(tooltipIsInViewport({x: 0, y: 400}, tooltipBox)).toBe(true);
    expect(tooltipIsInViewport({x: 400, y: 0}, tooltipBox)).toBe(true);
  });
  test('should return false if the tooltip is not in the viewport', () => {
    expect(tooltipIsInViewport({x: -1, y: 0}, tooltipBox)).toBe(false);
    expect(tooltipIsInViewport({x: 0, y: -1}, tooltipBox)).toBe(false);
    expect(tooltipIsInViewport({x: 401, y: 0}, tooltipBox)).toBe(false);
    expect(tooltipIsInViewport({x: 0, y: 401}, tooltipBox)).toBe(false);
  });
});

describe('mouseIsOnTooltip()', () => {
  const tooltipBox = {width: 100, height: 100};
  test('should return true if the mouse is on the tooltip', () => {
    expect(mouseIsOnTooltip(defaultMouseEvent, {x: 0, y: 0}, tooltipBox)).toBe(true);
    expect(mouseIsOnTooltip(defaultMouseEvent, {x: 50, y: 50}, tooltipBox)).toBe(true);
    expect(mouseIsOnTooltip(defaultMouseEvent, {x: 100, y: 100}, tooltipBox)).toBe(true);
    expect(mouseIsOnTooltip(defaultMouseEvent, {x: 100, y: 0}, tooltipBox)).toBe(true);
    expect(mouseIsOnTooltip(defaultMouseEvent, {x: 0, y: 100}, tooltipBox)).toBe(true);
  });
  test('should return false if the mouse is not on the tooltip', () => {
    expect(mouseIsOnTooltip(defaultMouseEvent, {x: -1, y: 0}, tooltipBox)).toBe(false);
    expect(mouseIsOnTooltip(defaultMouseEvent, {x: 0, y: -1}, tooltipBox)).toBe(false);
    expect(mouseIsOnTooltip(defaultMouseEvent, {x: 101, y: 0}, tooltipBox)).toBe(false);
    expect(mouseIsOnTooltip(defaultMouseEvent, {x: 0, y: 101}, tooltipBox)).toBe(false);
  });
});
