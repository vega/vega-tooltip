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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBb0M7QUFFcEMscUNBQTREO0FBQzVELDZDQUE2QztBQUM3QyxxREFBb0Q7QUFDcEQsbURBQThJO0FBRTlJLElBQUksY0FBYyxHQUFXLFNBQVMsQ0FBQztBQUN2QyxJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7QUFFMUI7Ozs7R0FJRztBQUNILGNBQXFCLE1BQWMsRUFBRSxPQUE2RDtJQUE3RCx3QkFBQSxFQUFBLFlBQW1CLGFBQWEsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBQztJQUNoRyxLQUFLLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBRXBDLE9BQU87UUFDTCxPQUFPLEVBQUU7WUFDUCx5QkFBeUI7WUFDekIsTUFBTSxDQUFDLG1CQUFtQixDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDcEQsTUFBTSxDQUFDLG1CQUFtQixDQUFDLHlCQUF5QixDQUFDLENBQUM7WUFDdEQsTUFBTSxDQUFDLG1CQUFtQixDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFFckQsYUFBYSxFQUFFLENBQUMsQ0FBQyx3QkFBd0I7UUFDM0MsQ0FBQztLQUNGLENBQUM7QUFDSixDQUFDO0FBYkQsb0JBYUM7QUFFRCxrQkFBeUIsTUFBYyxFQUFFLE1BQW9CLEVBQUUsT0FBNkQ7SUFBN0Qsd0JBQUEsRUFBQSxZQUFtQixhQUFhLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUM7SUFDMUgsT0FBTyxHQUFHLG1DQUFpQixDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMxRCxLQUFLLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBRXBDLE9BQU87UUFDTCxPQUFPLEVBQUU7WUFDUCx5QkFBeUI7WUFDekIsTUFBTSxDQUFDLG1CQUFtQixDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDcEQsTUFBTSxDQUFDLG1CQUFtQixDQUFDLHlCQUF5QixDQUFDLENBQUM7WUFDdEQsTUFBTSxDQUFDLG1CQUFtQixDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFFckQsYUFBYSxFQUFFLENBQUMsQ0FBQyx3QkFBd0I7UUFDM0MsQ0FBQztLQUNGLENBQUM7QUFDSixDQUFDO0FBZEQsNEJBY0M7QUFFRCxlQUFlLE1BQWMsRUFBRSxPQUFlO0lBQzVDLDhEQUE4RDtJQUM5RCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsdUJBQXVCLEVBQUUsVUFBVSxLQUFpQixFQUFFLElBQWdCO1FBQzVGLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDM0IsNkVBQTZFO1lBQzdFLGFBQWEsRUFBRSxDQUFDO1lBRWhCLGlEQUFpRDtZQUNqRCxjQUFjLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztnQkFDakMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDN0IsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxLQUFLLElBQUksZUFBSyxDQUFDLENBQUM7U0FDNUI7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILHdDQUF3QztJQUN4Qyx3Q0FBd0M7SUFDeEMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLHlCQUF5QixFQUFFLFVBQVUsS0FBaUIsRUFBRSxJQUFnQjtRQUM5RixJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLGFBQWEsRUFBRTtZQUM1QyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztTQUM5QjtJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsNkJBQTZCO0lBQzdCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyx3QkFBd0IsRUFBRSxVQUFVLEtBQWlCLEVBQUUsSUFBZ0I7UUFDN0YsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUMzQixhQUFhLEVBQUUsQ0FBQztZQUVoQixJQUFJLGFBQWEsRUFBRTtnQkFDakIsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDN0I7U0FDRjtJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELDRCQUE0QjtBQUM1QjtJQUNFOzt5Q0FFcUM7SUFDckMsTUFBTSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNwQyxjQUFjLEdBQUcsU0FBUyxDQUFDO0FBQzdCLENBQUM7QUFFRCxrQ0FBa0M7QUFDbEMsY0FBYyxLQUFpQixFQUFFLElBQWdCLEVBQUUsT0FBZTtJQUNoRSwrQkFBK0I7SUFDL0IsSUFBTSxrQkFBa0IsR0FBRyxzQ0FBcUIsRUFBRSxDQUFDO0lBRW5ELDJCQUEyQjtJQUMzQixJQUFNLFdBQVcsR0FBRyw0QkFBYyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNsRCxJQUFJLENBQUMsV0FBVyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQzVDLE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0lBRUQsd0NBQXdDO0lBQ3hDLHlCQUFRLENBQUMsa0JBQWtCLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFFMUMsK0JBQWMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDL0IsaUNBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDMUIscUJBQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3RELGFBQWEsR0FBRyxJQUFJLENBQUM7SUFFckIsZ0NBQWdDO0lBQ2hDLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtRQUNwQixPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztLQUMvQjtBQUNILENBQUM7QUFFRCwwQ0FBMEM7QUFDMUMsZ0JBQWdCLEtBQWlCLEVBQUUsSUFBZ0IsRUFBRSxPQUFlO0lBQ2xFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUM1QixPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUNELCtCQUFjLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRS9CLGdDQUFnQztJQUNoQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7UUFDbEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDN0I7QUFDSCxDQUFDO0FBRUQsbUJBQW1CO0FBQ25CLGVBQWUsS0FBaUIsRUFBRSxJQUFnQixFQUFFLE9BQWU7SUFDakUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFFO1FBQzVCLE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0lBQ0QsNENBQTRDO0lBQzVDLHdFQUF3RTtJQUN4RSxxQkFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFFckQsYUFBYSxHQUFHLEtBQUssQ0FBQztJQUN0QiwwQkFBUyxFQUFFLENBQUM7SUFDWixnQ0FBZSxFQUFFLENBQUM7SUFDbEIsOEJBQWEsRUFBRSxDQUFDO0lBRWhCLGdDQUFnQztJQUNoQyxJQUFJLE9BQU8sQ0FBQyxXQUFXLEVBQUU7UUFDdkIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDbEM7QUFDSCxDQUFDO0FBRUQsa0RBQWtEO0FBQ2xELDJCQUEyQixJQUFnQjtJQUN6QyxtQkFBbUI7SUFDbkIsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFDeEIsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUNELG1FQUFtRTtJQUNuRSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO1FBQ3ZCLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFFRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRDs7R0FFRztBQUNILHFCQUFxQixPQUFlO0lBQ2xDLElBQU0sVUFBVSxHQUFXLEVBQUUsQ0FBQztJQUM5QixLQUFLLElBQU0sS0FBSyxJQUFJLE9BQU8sRUFBRTtRQUMzQixJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDakMsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNwQztLQUNGO0lBQ0QsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQyJ9