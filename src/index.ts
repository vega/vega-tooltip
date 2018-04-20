import {select} from 'd3-selection';
import {TopLevelSpec} from 'vega-lite';
import {DELAY, Option, Scenegraph, VgView} from './options';
import {getTooltipData} from './parseOption';
import {supplementOptions} from './supplementField';
import {bindData, clearColorTheme, clearData, clearPosition, getTooltipPlaceholder, updateColorTheme, updatePosition} from './tooltipDisplay';

let tooltipPromise: number = undefined;
let tooltipActive = false;

/**
 * Export API for Vega visualizations: vg.tooltip(vgView, options)
 * options can specify whether to show all fields or to show only custom fields
 * It can also provide custom title and format for fields
 */
export function vega(vgView: VgView, options: Option = {showAllFields: true, isComposition: false}) {
  return start(vgView, copyOptions(options));
}

export function vegaLite(vgView: VgView, vlSpec: TopLevelSpec, options: Option = {showAllFields: true, isComposition: false}) {
  options = supplementOptions(vgView.warn.bind(vgView), copyOptions(options), vlSpec);
  return start(vgView, options);
}

function start(vgView: VgView, options: Option) {
  // TODO: ideally many of the existing functions should be moved to a proper class with this var as a member field
  const warn = vgView.warn.bind(vgView);
  const tooltipId = options && options.tooltipElemId || 'vis-tooltip';

  // initialize tooltip with item data and options on mouse over
  vgView.addEventListener('mouseover.tooltipInit', function (event: MouseEvent, item: Scenegraph) {
    if (shouldShowTooltip(item)) {
      // clear existing promise because mouse can only point at one thing at a time
      cancelPromise();

      // make a new promise with time delay for tooltip
      tooltipPromise = window.setTimeout(function () {
        try {
          init(warn, tooltipId, event, item, options);
        } catch (err) {
          vgView.error(err);
        }
      }, options.delay || DELAY);
    }
  });

  // update tooltip position on mouse move
  // (important for large marks e.g. bars)
  vgView.addEventListener('mousemove.tooltipUpdate', function (event: MouseEvent, item: Scenegraph) {
    if (shouldShowTooltip(item) && tooltipActive) {
      update(event, item, options, tooltipId);
    }
  });

  // clear tooltip on mouse out
  vgView.addEventListener('mouseout.tooltipRemove', function (event: MouseEvent, item: Scenegraph) {
    if (shouldShowTooltip(item)) {
      cancelPromise();

      if (tooltipActive) {
        clear(event, item, options, tooltipId);
      }
    }
  });

  return {
    destroy: function () {
      // remove event listeners
      vgView.removeEventListener('mouseover.tooltipInit');
      vgView.removeEventListener('mousemove.tooltipUpdate');
      vgView.removeEventListener('mouseout.tooltipRemove');

      cancelPromise(); // clear tooltip promise
    }
  };

}

/* Cancel tooltip promise */
function cancelPromise() {
  /* We don't check if tooltipPromise is valid because passing
   an invalid ID to clearTimeout does not have any effect
   (and doesn't throw an exception). */
  window.clearTimeout(tooltipPromise);
  tooltipPromise = undefined;
}

/* Initialize tooltip with data */
function init(warn, tooltipId: string, event: MouseEvent, item: Scenegraph, options: Option): void {
  // get tooltip HTML placeholder
  const tooltipPlaceholder = getTooltipPlaceholder(tooltipId);

  // prepare data for tooltip
  const tooltipData = getTooltipData(warn, item, options);
  if (!tooltipData || tooltipData.length === 0) {
    return undefined;
  }

  // bind data to tooltip HTML placeholder
  bindData(tooltipPlaceholder, tooltipData);

  updatePosition(event, options, tooltipId);
  updateColorTheme(options, tooltipId);
  select('#' + tooltipId).style('visibility', 'visible');
  tooltipActive = true;

  // invoke user-provided callback
  if (options.onAppear) {
    options.onAppear(event, item);
  }
}

/* Update tooltip position on mousemove */
function update(event: MouseEvent, item: Scenegraph, options: Option, tooltipId): void {
  if (!shouldShowTooltip(item)) {
    return undefined;
  }
  updatePosition(event, options, tooltipId);

  // invoke user-provided callback
  if (options.onMove) {
    options.onMove(event, item);
  }
}

/* Clear tooltip */
function clear(event: MouseEvent, item: Scenegraph, options: Option, tooltipId: string): void {
  if (!shouldShowTooltip(item)) {
    return undefined;
  }
  // visibility hidden instead of display none
  // because we need computed tooltip width and height to best position it
  select('#' + tooltipId).style('visibility', 'hidden');

  tooltipActive = false;
  clearData(tooltipId);
  clearColorTheme(tooltipId);
  clearPosition(tooltipId);

  // invoke user-provided callback
  if (options.onDisappear) {
    options.onDisappear(event, item);
  }
}

/* Decide if a Scenegraph item deserves tooltip */
function shouldShowTooltip(item: Scenegraph) {
  // no data, no show
  if (!item || !item.datum) {
    return false;
  }
  // (small multiples) avoid showing tooltip for a facet's background
  if (item.datum._facetID) {
    return false;
  }

  return true;
}

/**
 * Copy options into new objects to prevent causing side-effect to original object
 */
function copyOptions(options: Option) {
  const newOptions: Option = {};
  for (const field in options) {
    if (options.hasOwnProperty(field)) {
      newOptions[field] = options[field];
    }
  }
  return newOptions;
}
