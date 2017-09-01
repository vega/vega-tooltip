"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3_selection_1 = require("d3-selection");
var options_1 = require("./options");
var parseOption_1 = require("./parseOption");
var supplementField_1 = require("./supplementField");
var tooltipDisplay_1 = require("./tooltipDisplay");
var tooltipPromise = undefined;
var tooltipActive = false;
/**
 * Export API for Vega visualizations: vg.tooltip(vgView, options)
 * options can specify whether to show all fields or to show only custom fields
 * It can also provide custom title and format for fields
 */
function vega(vgView, options) {
    if (options === void 0) { options = { showAllFields: true }; }
    start(vgView, copyOptions(options));
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
exports.vega = vega;
function vegaLite(vgView, vlSpec, options) {
    if (options === void 0) { options = { showAllFields: true }; }
    options = supplementField_1.supplementOptions(copyOptions(options), vlSpec);
    start(vgView, options);
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
exports.vegaLite = vegaLite;
function start(vgView, options) {
    // initialize tooltip with item data and options on mouse over
    vgView.addEventListener('mouseover.tooltipInit', function (event, item) {
        if (shouldShowTooltip(item)) {
            // clear existing promise because mouse can only point at one thing at a time
            cancelPromise();
            // make a new promise with time delay for tooltip
            tooltipPromise = window.setTimeout(function () {
                init(event, item, options);
            }, options.delay || options_1.DELAY);
        }
    });
    // update tooltip position on mouse move
    // (important for large marks e.g. bars)
    vgView.addEventListener('mousemove.tooltipUpdate', function (event, item) {
        if (shouldShowTooltip(item) && tooltipActive) {
            update(event, item, options);
        }
    });
    // clear tooltip on mouse out
    vgView.addEventListener('mouseout.tooltipRemove', function (event, item) {
        if (shouldShowTooltip(item)) {
            cancelPromise();
            if (tooltipActive) {
                clear(event, item, options);
            }
        }
    });
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
function init(event, item, options) {
    // get tooltip HTML placeholder
    var tooltipPlaceholder = tooltipDisplay_1.getTooltipPlaceholder();
    // prepare data for tooltip
    var tooltipData = parseOption_1.getTooltipData(item, options);
    if (!tooltipData || tooltipData.length === 0) {
        return undefined;
    }
    // bind data to tooltip HTML placeholder
    tooltipDisplay_1.bindData(tooltipPlaceholder, tooltipData);
    tooltipDisplay_1.updatePosition(event, options);
    tooltipDisplay_1.updateColorTheme(options);
    d3_selection_1.select('#vis-tooltip').style('visibility', 'visible');
    tooltipActive = true;
    // invoke user-provided callback
    if (options.onAppear) {
        options.onAppear(event, item);
    }
}
/* Update tooltip position on mousemove */
function update(event, item, options) {
    if (!shouldShowTooltip(item)) {
        return undefined;
    }
    tooltipDisplay_1.updatePosition(event, options);
    // invoke user-provided callback
    if (options.onMove) {
        options.onMove(event, item);
    }
}
/* Clear tooltip */
function clear(event, item, options) {
    if (!shouldShowTooltip(item)) {
        return undefined;
    }
    // visibility hidden instead of display none
    // because we need computed tooltip width and height to best position it
    d3_selection_1.select('#vis-tooltip').style('visibility', 'hidden');
    tooltipActive = false;
    tooltipDisplay_1.clearData();
    tooltipDisplay_1.clearColorTheme();
    tooltipDisplay_1.clearPosition();
    // invoke user-provided callback
    if (options.onDisappear) {
        options.onDisappear(event, item);
    }
}
/* Decide if a Scenegraph item deserves tooltip */
function shouldShowTooltip(item) {
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
function copyOptions(options) {
    var newOptions = {};
    for (var field in options) {
        if (options.hasOwnProperty(field)) {
            newOptions[field] = options[field];
        }
    }
    return newOptions;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBb0M7QUFFcEMscUNBQTREO0FBQzVELDZDQUE2QztBQUM3QyxxREFBb0Q7QUFDcEQsbURBQThJO0FBRTlJLElBQUksY0FBYyxHQUFXLFNBQVMsQ0FBQztBQUN2QyxJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7QUFFMUI7Ozs7R0FJRztBQUNILGNBQXFCLE1BQWMsRUFBRSxPQUF1QztJQUF2Qyx3QkFBQSxFQUFBLFlBQW1CLGFBQWEsRUFBRSxJQUFJLEVBQUM7SUFDMUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUVwQyxNQUFNLENBQUM7UUFDTCxPQUFPLEVBQUU7WUFDUCx5QkFBeUI7WUFDekIsTUFBTSxDQUFDLG1CQUFtQixDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDcEQsTUFBTSxDQUFDLG1CQUFtQixDQUFDLHlCQUF5QixDQUFDLENBQUM7WUFDdEQsTUFBTSxDQUFDLG1CQUFtQixDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFFckQsYUFBYSxFQUFFLENBQUMsQ0FBQyx3QkFBd0I7UUFDM0MsQ0FBQztLQUNGLENBQUM7QUFDSixDQUFDO0FBYkQsb0JBYUM7QUFFRCxrQkFBeUIsTUFBYyxFQUFFLE1BQTRCLEVBQUUsT0FBdUM7SUFBdkMsd0JBQUEsRUFBQSxZQUFtQixhQUFhLEVBQUUsSUFBSSxFQUFDO0lBQzVHLE9BQU8sR0FBRyxtQ0FBaUIsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDMUQsS0FBSyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUV2QixNQUFNLENBQUM7UUFDTCxPQUFPLEVBQUU7WUFDUCx5QkFBeUI7WUFDekIsTUFBTSxDQUFDLG1CQUFtQixDQUFDLHVCQUF1QixDQUFDLENB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