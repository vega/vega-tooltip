import {select} from 'd3-selection';
import {TopLevelExtendedSpec} from 'vega-lite/build/src/spec';
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
export function vega(vgView: VgView, options: Option = {showAllFields: true}) {
  // initialize tooltip with item data and options on mouse over
  vgView.addEventListener('mouseover.tooltipInit', function (event: MouseEvent, item: Scenegraph) {
    if (shouldShowTooltip(item)) {
      // clear existing promise because mouse can only point at one thing at a time
      cancelPromise();

      tooltipPromise = window.setTimeout(function () {
        init(event, item, options);
      }, options.delay || DELAY);
    }
  });

  // update tooltip position on mouse move
  // (important for large marks e.g. bars)
  vgView.addEventListener('mousemove.tooltipUpdate', function (event: MouseEvent, item: Scenegraph) {
    if (shouldShowTooltip(item) && tooltipActive) {
      update(event, item, options);
    }
  });

  // clear tooltip on mouse out
  vgView.addEventListener('mouseout.tooltipRemove', function (event: MouseEvent, item: Scenegraph) {
    if (shouldShowTooltip(item)) {
      cancelPromise();

      if (tooltipActive) {
        clear(event, item, options);
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
};

export function vegaLite(vgView: VgView, vlSpec: TopLevelExtendedSpec, options: Option = {showAllFields: true}) {
  options = supplementOptions(options, vlSpec);

  // TODO: update this to use new vega-view api (addEventListener)
  // initialize tooltip with item data and options on mouse over
  vgView.addEventListener('mouseover.tooltipInit', function (event: MouseEvent, item: Scenegraph) {
    if (shouldShowTooltip(item)) {
      // clear existing promise because mouse can only point at one thing at a time
      cancelPromise();

      // make a new promise with time delay for tooltip
      tooltipPromise = window.setTimeout(function () {
        init(event, item, options);
      }, options.delay || DELAY);
    }
  });

  // update tooltip position on mouse move
  // (important for large marks e.g. bars)
  vgView.addEventListener('mousemove.tooltipUpdate', function (event: MouseEvent, item: Scenegraph) {
    if (shouldShowTooltip(item) && tooltipActive) {
      update(event, item, options);
    }
  });

  // clear tooltip on mouse out
  vgView.addEventListener('mouseout.tooltipRemove', function (event: MouseEvent, item: Scenegraph) {
    if (shouldShowTooltip(item)) {
      cancelPromise();

      if (tooltipActive) {
        clear(event, item, options);
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
};

/* Cancel tooltip promise */
function cancelPromise() {
  /* We don't check if tooltipPromise is valid because passing
   an invalid ID to clearTimeout does not have any effect
   (and doesn't throw an exception). */
  if (tooltipPromise) {
    window.clearTimeout(tooltipPromise);
    tooltipPromise = undefined;
  }
}

/* Initialize tooltip with data */
function init(event: MouseEvent, item: Scenegraph, options: Option) {
  // get tooltip HTML placeholder
  const tooltipPlaceholder = getTooltipPlaceholder();

  // prepare data for tooltip
  const tooltipData = getTooltipData(item, options);
  if (!tooltipData || tooltipData.length === 0) {
    return undefined;
  }

  // bind data to tooltip HTML placeholder
  bindData(tooltipPlaceholder, tooltipData);

  updatePosition(event, options);
  updateColorTheme(options);
  select('#vis-tooltip').style('visibility', 'visible');
  tooltipActive = true;

  // invoke user-provided callback
  if (options.onAppear) {
    options.onAppear(event, item);
  }
}

/* Update tooltip position on mousemove */
function update(event: MouseEvent, item: Scenegraph, options: Option) {
  updatePosition(event, options);

  // invoke user-provided callback
  if (options.onMove) {
    options.onMove(event, item);
  }
}

/* Clear tooltip */
function clear(event: MouseEvent, item: Scenegraph, options: Option) {
  // visibility hidden instead of display none
  // because we need computed tooltip width and height to best position it
  select('#vis-tooltip').style('visibility', 'hidden');

  tooltipActive = false;
  clearData();
  clearColorTheme();
  clearPosition();

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
  // avoid showing tooltip for axis title and labels
  if (!item.datum._id) {
    return false;
  }
  return true;
}
