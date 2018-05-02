import { escapeHTML, formatValue } from '../src';
import { replacer } from '../src/formatValue';

const fv = (value: any) => formatValue(value, escapeHTML, 2);

describe('formatValue', () => {
  it('should handle simple cases', () => {
    expect(fv(undefined)).toBe('undefined');
    expect(fv(0)).toBe('0');
    expect(fv(null)).toBe('null');
    expect(fv('')).toBe('');
    expect(fv(true)).toBe('true');
    expect(fv('<html> & </html>')).toBe('&lt;html> &amp; &lt;/html>');
    expect(fv('1234567890')).toBe('1234567890');
    expect(fv('1234567890'.repeat(100))).toBe('1234567890'.repeat(100));
  });

  it('should handle objects', () => {
    expect(fv({})).toBe('{}');

    expect(fv({ a: 1 })).toBe('<table><tr><td class="key">a:</td><td class="value">1</td></tr></table>');

    expect(fv({ a: [1, 2] })).toBe('<table><tr><td class="key">a:</td><td class="value">[1,2]</td></tr></table>');

    expect(fv({ a: {} })).toBe('<table><tr><td class="key">a:</td><td class="value">{}</td></tr></table>');

    expect(fv({ foo: 0, bar: false, nostr: '', null: null, html: '&<script>' })).toBe(
      '<table>' +
        '<tr><td class="key">foo:</td><td class="value">0</td></tr>' +
        '<tr><td class="key">bar:</td><td class="value">false</td></tr>' +
        '<tr><td class="key">nostr:</td><td class="value"></td></tr>' +
        '<tr><td class="key">null:</td><td class="value">null</td></tr>' +
        '<tr><td class="key">html:</td><td class="value">&amp;&lt;script></td></tr>' +
        '</table>'
    );

    expect(fv({ a: { b: [1, 2] } })).toBe(
      '<table><tr><td class="key">a:</td><td class="value">{"b":[1,2]}</td></tr></table>'
    );

    // title should not output table
    expect(fv({ title: 'eh' })).toBe('<h2>eh</h2>');
    expect(fv({ title: '&<script>' })).toBe('<h2>&amp;&lt;script></h2>');

    // title should not output table
    expect(fv({ title: 'eh', foo: 42 })).toBe(
      '<h2>eh</h2><table><tr><td class="key">foo:</td><td class="value">42</td></tr></table>'
    );

    const recursive: any = {};
    recursive.foo = recursive;
    expect(fv(recursive)).toBe(
      '<table><tr>' + '<td class="key">foo:</td>' + '<td class="value">{"foo":"[Circular]"}</td>' + '</tr></table>'
    );

    const recursive2: any = {};
    recursive2.foo = { bar: recursive, a: 42 };
    expect(fv(recursive2)).toBe(
      '<table><tr>' +
        '<td class="key">foo:</td>' +
        '<td class="value">{"bar":{"foo":"[Circular]"},"a":42}</td>' +
        '</tr></table>'
    );
  });

  it('should handle arrays', () => {
    expect(fv([])).toBe('[]');

    expect(fv([0])).toBe('[0]');
    expect(fv([0, 1])).toBe('[0, 1]');

    expect(fv([''])).toBe('[]'); // <--- FIXME: IS THIS WHAT WE WANT?
    expect(fv(['', ''])).toBe('[, ]'); // <--- FIXME: IS THIS WHAT WE WANT?

    expect(fv(['a', 'b'])).toBe('[a, b]');
    expect(fv(['&<script>'])).toBe('[&amp;&lt;script>]');
    expect(fv([{ foo: '&<script>' }])).toBe('[{"foo":"&amp;&lt;script>"}]');

    expect(fv([{}, 'b'])).toBe('[{}, b]');
    expect(fv([{ foo: 42 }, 'b'])).toBe('[{"foo":42}, b]');
  });
});

describe('replacer', () => {
  it('should work for stringify', () => {
    expect(JSON.stringify({ a: 42 }, replacer(2))).toBe('{"a":42}');
  });

  it('should support circular', () => {
    const x = { x: null, a: { b: { c: { d: { e: { f: 42 } } } } } };
    x.x = x;
    expect(JSON.stringify(x, replacer(2))).toBe('{"x":"[Circular]","a":{"b":{"c":"[Object]"}}}');
  });
});
