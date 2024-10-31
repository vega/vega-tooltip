import {calculatePositionRelativeToCursor} from '../src';

global.window = Object.create({});
Object.defineProperty(window, 'innerWidth', {value: 500});
Object.defineProperty(window, 'innerHeight', {value: 500});

const defaultTooltipBox = {width: 100, height: 100};
const defaultMouseEvent = {clientX: 100, clientY: 100} as MouseEvent;
const defaultOffsetX = 10;
const defaultOffsetY = 10;

describe('calculatePositionRelativeToCursor()', () => {
  test('should return position in bottom right corner of cursor if there is enough space', () => {
    const position = calculatePositionRelativeToCursor(
      defaultMouseEvent,
      defaultTooltipBox,
      defaultOffsetX,
      defaultOffsetY,
    );
    expect(position).toEqual({x: 110, y: 110});
  });
  test('should return position in top right corner of cursor if there is not space below', () => {
    const position = calculatePositionRelativeToCursor(
      {...defaultMouseEvent, clientY: 480},
      defaultTooltipBox,
      defaultOffsetX,
      defaultOffsetY,
    );
    expect(position).toEqual({x: 110, y: 370});
  });
  test('should return position in bottom left corner of cursor if there is not space to the right', () => {
    const position = calculatePositionRelativeToCursor(
      {...defaultMouseEvent, clientX: 480},
      defaultTooltipBox,
      defaultOffsetX,
      defaultOffsetY,
    );
    expect(position).toEqual({x: 370, y: 110});
  });
  test('should return position in top left corner of cursor if there is not space below and to the right', () => {
    const position = calculatePositionRelativeToCursor(
      {...defaultMouseEvent, clientX: 480, clientY: 480},
      defaultTooltipBox,
      defaultOffsetX,
      defaultOffsetY,
    );
    expect(position).toEqual({x: 370, y: 370});
  });
});
