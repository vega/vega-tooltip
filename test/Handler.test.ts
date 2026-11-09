/**
 * @vitest-environment jsdom
 */

import {Item} from 'vega-typings/types';
import {DEFAULT_OPTIONS, Handler} from '../src/index.js';
import {expect, describe, it, beforeEach, afterEach, vi} from 'vitest';

/**
 * A minimal constructable stylesheet, since jsdom does not support `document.adoptedStyleSheets`.
 */
class FakeCSSStyleSheet {
  text = '';

  replaceSync(text: string) {
    this.text = text;
  }
}

function adoptedSheets() {
  return document.adoptedStyleSheets as unknown as FakeCSSStyleSheet[];
}

describe('Handler', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.head.innerHTML = '';
    vi.stubGlobal('CSSStyleSheet', FakeCSSStyleSheet);
    Object.defineProperty(document, 'adoptedStyleSheets', {value: [], writable: true, configurable: true});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete (document as {adoptedStyleSheets?: unknown}).adoptedStyleSheets;
  });

  it('instantiates a tooltip handler', () => {
    const handler = new Handler();

    expect(handler).toBeInstanceOf(Handler);
    expect(typeof handler.call).toBe('function');
  });

  it('renders tooltip element', () => {
    const handler = new Handler({});

    handler.call(handler, new MouseEvent(''), {} as Item<any>, 'foo');

    expect(document.querySelector(`#${DEFAULT_OPTIONS.id}`)).not.toBeNull();
  });

  describe('default style', () => {
    it('adopts a stylesheet instead of adding a <style> element', () => {
      new Handler();

      expect(document.head.querySelector('style')).toBeNull();
      expect(adoptedSheets()).toHaveLength(1);
      expect(adoptedSheets()[0].text).toContain(`#${DEFAULT_OPTIONS.id}`);
    });

    it('wraps the styles in a cascade layer so page styles can override them', () => {
      new Handler();

      expect(adoptedSheets()[0].text).toMatch(/^@layer vega-tooltip \{/);
    });

    it('adopts the stylesheet only once per `styleId`', () => {
      new Handler();
      new Handler();
      new Handler({styleId: 'foo'});

      expect(adoptedSheets()).toHaveLength(2);
    });

    it('keeps stylesheets the page already adopted', () => {
      const pageSheet = new FakeCSSStyleSheet();
      document.adoptedStyleSheets = [pageSheet as unknown as CSSStyleSheet];

      new Handler();

      expect(adoptedSheets()).toHaveLength(2);
      expect(adoptedSheets()[0]).toBe(pageSheet);
    });

    it('does not adopt a stylesheet if `disableDefaultStyle` is true', () => {
      new Handler({disableDefaultStyle: true});

      expect(adoptedSheets()).toHaveLength(0);
    });
  });

  describe('options', () => {
    describe('formatTooltip', () => {
      it('renders custom HTML returned by the supplied function', () => {
        const handler = new Handler({
          formatTooltip: (value, sanitize) => `<div class='foo'>${sanitize(value)}</div>`,
        });

        handler.call(handler, new MouseEvent(''), {} as Item<any>, 'bar');

        const tooltipEl = document.querySelector(`#${DEFAULT_OPTIONS.id}`);

        expect(tooltipEl).not.toBeNull();
        expect(tooltipEl?.querySelector('.foo')?.textContent).toBe('bar');
      });
    });
  });
});
