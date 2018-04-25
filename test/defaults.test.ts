import { escapeHTML } from '../src/defaults';

test('escapeHTML escapes HTML', () => {
  expect(escapeHTML('<div>hello</div>')).toBe('&lt;div>hello&lt;/div>');
});
