/**
 * @jest-environment jsdom
 */

import {Item} from 'vega-typings/types';
import {DEFAULT_OPTIONS, Handler} from '../src';

describe('Handler', () => {
  it('instantiates a tooltip handler', () => {
    const handler = new Handler();

    expect(handler).toBeInstanceOf(Handler);
    expect(typeof handler.call).toBe('function');
    expect(document.head.querySelector(`style#${DEFAULT_OPTIONS.styleId}`)).not.toBeNull();
  });

  it('renders tooltip element', () => {
    const handler = new Handler({});

    handler.call(handler, new MouseEvent(''), {} as Item<any>, 'foo');

    expect(document.querySelector(`#${DEFAULT_OPTIONS.id}`)).not.toBeNull();
  });

  describe('options', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
      document.head.innerHTML = '';
    });

    describe('disableDefaultStyle', () => {
      it('does not add a <style> element to the document head if `disableDefaultStyle` is true', () => {
        new Handler({disableDefaultStyle: true});
        expect(document.head.querySelector(`style#${DEFAULT_OPTIONS.styleId}`)).toBeNull();
      });
    });

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

    describe('styleId', () => {
      it('adds a <style> element with the specified `id` to the document head', () => {
        new Handler({styleId: 'foo'});
        expect(document.head.querySelector('style#foo')).not.toBeNull();
      });
    });
  });
});
