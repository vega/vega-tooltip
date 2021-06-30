import {DEFAULT_OPTIONS, Handler} from '../src';

describe('Handler', () => {
  it('instantiates a tooltip handler', () => {
    const handler = new Handler();

    expect(handler).toBeInstanceOf(Handler);
    expect(typeof handler.call).toBe('function');
    expect(document.head.querySelector(`style#${DEFAULT_OPTIONS.styleId}`)).not.toBeNull();
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

    describe('styleId', () => {
      it('adds a <style> element with the specified `id` to the document head', () => {
        new Handler({styleId: 'foo'});
        expect(document.head.querySelector('style#foo')).not.toBeNull();
      });
    });
  });
});
