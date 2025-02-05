import {escapeHTML} from '../src/defaults.js';
import {expect, test} from 'vitest';

test('escapeHTML escapes HTML', () => {
  expect(escapeHTML('<div>hello</div>')).toBe('&lt;div>hello&lt;/div>');
});
