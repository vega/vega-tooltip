import {describe, expect, it, vi, beforeEach} from 'vitest';
import {DEFAULT_OPTIONS, escapeHTML, Handler, Options} from '../src/index.js';
import {formatValue} from '../src/formatValue.js';

const format = (value: unknown, options: Pick<Options, 'titleKey' | 'imageKeys'>) =>
  formatValue(value, escapeHTML, 2, 'https://example.org/', options);

describe('special tooltip fields', () => {
  it('retains the existing title and image defaults', () => {
    expect(format({title: 'Movie', image: 'poster.png'}, {})).toBe(
      '<h2>Movie</h2><img src="https://example.org/poster.png">',
    );
    expect(format({title: 0, image: '', ordinary: false}, {})).toBe(
      '<table><tr><td class="key">ordinary</td><td class="value">false</td></tr></table>',
    );
  });

  it('uses configured title and image fields without reserving ordinary columns', () => {
    expect(
      format(
        {title: 'Movie', image: 'Poster', heading: '&<title>', photo: 'poster.png', another: 'other.png'},
        {titleKey: 'heading', imageKeys: ['photo', 'another']},
      ),
    ).toBe(
      '<h2>&amp;&lt;title></h2><img src="https://example.org/poster.png"><img src="https://example.org/other.png">' +
        '<table><tr><td class="key">title</td><td class="value">Movie</td></tr>' +
        '<tr><td class="key">image</td><td class="value">Poster</td></tr></table>',
    );
  });

  it('can disable both special fields and leaves the original object unchanged', () => {
    const value = Object.freeze({title: 'Movie', image: 'Poster'});
    expect(format(value, {titleKey: null, imageKeys: []})).toBe(
      '<table><tr><td class="key">title</td><td class="value">Movie</td></tr>' +
        '<tr><td class="key">image</td><td class="value">Poster</td></tr></table>',
    );
    expect(value).toEqual({title: 'Movie', image: 'Poster'});
  });

  it('can disable either special treatment independently', () => {
    expect(format({title: 'Movie', image: 'poster.png'}, {titleKey: null})).toBe(
      '<img src="https://example.org/poster.png"><table><tr><td class="key">title</td>' +
        '<td class="value">Movie</td></tr></table>',
    );
    expect(format({title: 'Movie', image: 'Poster'}, {imageKeys: []})).toBe(
      '<h2>Movie</h2><table><tr><td class="key">image</td><td class="value">Poster</td></tr></table>',
    );
  });

  it('does not reserve missing custom fields or change scalar and array formatting', () => {
    expect(format({title: 'Movie'}, {titleKey: 'heading', imageKeys: ['photo']})).toBe(
      '<table><tr><td class="key">title</td><td class="value">Movie</td></tr></table>',
    );
    expect(format(['a', '<b>'], {titleKey: null, imageKeys: []})).toBe('[a, &lt;b>]');
    expect(format(42, {titleKey: null, imageKeys: []})).toBe('42');
  });

  beforeEach(() => {
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  it('applies field options through the default Handler formatter', () => {
    const handler = new Handler({titleKey: null, imageKeys: []});
    handler.call(handler, new MouseEvent(''), {} as Parameters<typeof handler.call>[2], {
      title: 'Movie',
      image: 'Poster',
    });
    const el = document.getElementById(DEFAULT_OPTIONS.id)!;
    expect(el.querySelector('h2, img')).toBeNull();
    expect(el.querySelectorAll('tr')).toHaveLength(2);
  });

  it('preserves the custom formatter callback contract', () => {
    const custom = vi.fn(() => '<b>custom</b>');
    const handler = new Handler({titleKey: null, imageKeys: [], formatTooltip: custom});
    handler.call(handler, new MouseEvent(''), {} as Parameters<typeof handler.call>[2], {title: 'Movie'});
    expect(custom).toHaveBeenCalledWith({title: 'Movie'}, DEFAULT_OPTIONS.sanitize, DEFAULT_OPTIONS.maxDepth, '');
    expect(document.getElementById(DEFAULT_OPTIONS.id)!.innerHTML).toBe('<b>custom</b>');
  });
});
