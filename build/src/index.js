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
    if (options === void 0) { options = { showAllFields: true, isComposition: false }; }
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
    if (options === void 0) { options = { showAllFields: true, isComposition: false }; }
    options = supplementField_1.supplementOptions(copyOptions(options), vlSpec);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBb0M7QUFFcEMscUNBQTREO0FBQzVELDZDQUE2QztBQUM3QyxxREFBb0Q7QUFDcEQsbURBQThJO0FBRTlJLElBQUksY0FBYyxHQUFXLFNBQVMsQ0FBQztBQUN2QyxJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7QUFFMUI7Ozs7R0FJRztBQUNILGNBQXFCLE1BQWMsRUFBRSxPQUE2RDtJQUE3RCx3QkFBQSxFQUFBLFlBQW1CLGFBQWEsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBQztJQUNoRyxLQUFLLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBRXBDLE1BQU0sQ0FBQztRQUNMLE9BQU8sRUFBRTtZQUNQLHlCQUF5QjtZQUN6QixNQUFNLENBQUMsbUJBQW1CLENBQUMsdUJBQXVCLENBQUMsQ0FBQztZQUNwRCxNQUFNLENBQUMsbUJBQW1CLENBQUMseUJBQXlCLENBQUMsQ0FBQztZQUN0RCxNQUFNLENBQUMsbUJBQW1CLENBQUMsd0JBQXdCLENBQUMsQ0FBQztZQUVyRCxhQUFhLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QjtRQUMzQyxDQUFDO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFiRCxvQkFhQztBQUVELGtCQUF5QixNQUFjLEVBQUUsTUFBNEIsRUFBRSxPQUE2RDtJQUE3RCx3QkFBQSxFQUFBLFlBQW1CLGFBQWEsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBQztJQUNsSSxPQUFPLEdBQUcsbUNBQWlCLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzFELEtBQUssQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFFcEMsTUFBTSxDQUFDO1FBQ0wsT0FBTyxFQUFFO1lBQ1AseUJBQXlCO1lBQ3pCLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1lBQ3BELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBQ3RELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBRXJELGFBQWEsRUFBRSxDQUFDLENBQUMsd0JBQXdCO1FBQzNDLENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQztBQWRELDRCQWNDO0FBRUQsZUFBZSxNQUFjLEVBQUUsT0FBZTtJQUM1Qyw4REFBOEQ7SUFDOUQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLHVCQUF1QixFQUFFLFVBQVUsS0FBaUIsRUFBRSxJQUFnQjtRQUM1RixFQUFFLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsNkVBQTZFO1lBQzdFLGFBQWEsRUFBRSxDQUFDO1lBRWhCLGlEQUFpRDtZQUNqRCxjQUFjLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztnQkFDakMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDN0IsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxLQUFLLElBQUksZUFBSyxDQUFDLENBQUM7UUFDN0IsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsd0NBQXdDO0lBQ3hDLHdDQUF3QztJQUN4QyxNQUFNLENBQUMsZ0JBQWdCLENBQUMseUJBQXlCLEVBQUUsVUFBVSxLQUFpQixFQUFFLElBQWdCO1FBQzlGLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDN0MsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDL0IsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsNkJBQTZCO0lBQzdCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyx3QkFBd0IsRUFBRSxVQUFVLEtBQWlCLEVBQUUsSUFBZ0I7UUFDN0YsRUFBRSxDQUFDLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVCLGFBQWEsRUFBRSxDQUFDO1lBRWhCLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzlCLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsNEJBQTRCO0FBQzVCO0lBQ0U7O3lDQUVxQztJQUNyQyxNQUFNLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3BDLGNBQWMsR0FBRyxTQUFTLENBQUM7QUFDN0IsQ0FBQztBQUVELGtDQUFrQztBQUNsQyxjQUFjLEtBQWlCLEVBQUUsSUFBZ0IsRUFBRSxPQUFlO0lBQ2hFLCtCQUErQjtJQUMvQixJQUFNLGtCQUFrQixHQUFHLHNDQUFxQixFQUFFLENBQUM7SUFFbkQsMkJBQTJCO0lBQzNCLElBQU0sV0FBVyxHQUFHLDRCQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2xELEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QyxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFRCx3Q0FBd0M7SUFDeEMseUJBQVEsQ0FBQyxrQkFBa0IsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUUxQywrQkFBYyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMvQixpQ0FBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxQixxQkFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDdEQsYUFBYSxHQUFHLElBQUksQ0FBQztJQUVyQixnQ0FBZ0M7SUFDaEMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDckIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDaEMsQ0FBQztBQUNILENBQUM7QUFFRCwwQ0FBMEM7QUFDMUMsZ0JBQWdCLEtBQWlCLEVBQUUsSUFBZ0IsRUFBRSxPQUFlO0lBQ2xFLEVBQUUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUNELCtCQUFjLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRS9CLGdDQUFnQztJQUNoQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNuQixPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0FBQ0gsQ0FBQztBQUVELG1CQUFtQjtBQUNuQixlQUFlLEtBQWlCLEVBQUUsSUFBZ0IsRUFBRSxPQUFlO0lBQ2pFLEVBQUUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUNELDRDQUE0QztJQUM1Qyx3RUFBd0U7SUFDeEUscUJBQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBRXJELGFBQWEsR0FBRyxLQUFLLENBQUM7SUFDdEIsMEJBQVMsRUFBRSxDQUFDO0lBQ1osZ0NBQWUsRUFBRSxDQUFDO0lBQ2xCLDhCQUFhLEVBQUUsQ0FBQztJQUVoQixnQ0FBZ0M7SUFDaEMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDeEIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQztBQUNILENBQUM7QUFFRCxrREFBa0Q7QUFDbEQsMkJBQTJCLElBQWdCO0lBQ3pDLG1CQUFtQjtJQUNuQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZixDQUFDO0lBQ0QsbUVBQW1FO0lBQ25FLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUN4QixNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxxQkFBcUIsT0FBZTtJQUNsQyxJQUFNLFVBQVUsR0FBVyxFQUFFLENBQUM7SUFDOUIsR0FBRyxDQUFDLENBQUMsSUFBTSxLQUFLLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQztRQUM1QixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLENBQUM7SUFDSCxDQUFDO0lBQ0QsTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUNwQixDQUFDIn0=