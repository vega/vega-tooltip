"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3_selection_1 = require("d3-selection");
/**
 * Get the tooltip HTML placeholder by id selector "#vis-tooltip"
 * If none exists, create a placeholder.
 * @returns the HTML placeholder for tooltip
 */
function getTooltipPlaceholder() {
    var tooltipPlaceholder;
    if (d3_selection_1.select('#vis-tooltip').empty()) {
        tooltipPlaceholder = d3_selection_1.select('body').append('div')
            .attr('id', 'vis-tooltip')
            .attr('class', 'vg-tooltip');
    }
    else {
        tooltipPlaceholder = d3_selection_1.select('#vis-tooltip');
    }
    return tooltipPlaceholder;
}
exports.getTooltipPlaceholder = getTooltipPlaceholder;
/**
 * Bind tooltipData to the tooltip placeholder
 */
function bindData(tooltipPlaceholder, tooltipData) {
    tooltipPlaceholder.selectAll('table').remove();
    var tooltipRows = tooltipPlaceholder.append('table').selectAll('.tooltip-row')
        .data(tooltipData);
    tooltipRows.exit().remove();
    tooltipRows.enter().append('tr')
        .attr('class', 'tooltip-row')
        .each(function (d) {
        var sel = d3_selection_1.select(this);
        if (d.render) {
            sel.append('td')
                .attr('colspan', '2')
                .append(function () { return d.render(d.title, d.value); });
        }
        else {
            sel.append('td').attr('class', 'key').text(function (data) { return data.title + ':'; });
            sel.append('td').attr('class', 'value').text(function (data) { return data.value; });
        }
    });
}
exports.bindData = bindData;
/**
 * Clear tooltip data
 */
function clearData() {
    d3_selection_1.select('#vis-tooltip').selectAll('.tooltip-row').data([])
        .exit().remove();
}
exports.clearData = clearData;
/**
 * Update tooltip position
 * Default position is 10px right of and 10px below the cursor. This can be
 * overwritten by options.offset
 */
function updatePosition(event, options) {
    // determine x and y offsets, defaults are 10px
    var offsetX = 10;
    var offsetY = 10;
    if (options && options.offset && (options.offset.x !== undefined) && (options.offset.x !== null)) {
        offsetX = options.offset.x;
    }
    if (options && options.offset && (options.offset.y !== undefined) && (options.offset.y !== null)) {
        offsetY = options.offset.y;
    }
    // TODO: use the correct time type
    d3_selection_1.select('#vis-tooltip')
        .style('top', function () {
        // by default: put tooltip 10px below cursor
        // if tooltip is close to the bottom of the window, put tooltip 10px above cursor
        var tooltipHeight = this.getBoundingClientRect().height;
        if (event.clientY + tooltipHeight + offsetY < window.innerHeight) {
            return '' + (event.clientY + offsetY) + 'px';
        }
        else {
            return '' + (event.clientY - tooltipHeight - offsetY) + 'px';
        }
    })
        .style('left', function () {
        // by default: put tooltip 10px to the right of cursor
        // if tooltip is close to the right edge of the window, put tooltip 10 px to the left of cursor
        var tooltipWidth = this.getBoundingClientRect().width;
        if (event.clientX + tooltipWidth + offsetX < window.innerWidth) {
            return '' + (event.clientX + offsetX) + 'px';
        }
        else {
            return '' + (event.clientX - tooltipWidth - offsetX) + 'px';
        }
    });
}
exports.updatePosition = updatePosition;
/* Clear tooltip position */
function clearPosition() {
    d3_selection_1.select('#vis-tooltip')
        .style('top', '-9999px')
        .style('left', '-9999px');
}
exports.clearPosition = clearPosition;
/**
 * Update tooltip color theme according to options.colorTheme
 *
 * If colorTheme === "dark", apply dark theme to tooltip.
 * Otherwise apply light color theme.
 */
function updateColorTheme(options) {
    clearColorTheme();
    if (options && options.colorTheme === 'dark') {
        d3_selection_1.select('#vis-tooltip').classed('dark-theme', true);
    }
    else {
        d3_selection_1.select('#vis-tooltip').classed('light-theme', true);
    }
}
exports.updateColorTheme = updateColorTheme;
/* Clear color themes */
function clearColorTheme() {
    d3_selection_1.select('#vis-tooltip').classed('dark-theme light-theme', false);
}
exports.clearColorTheme = clearColorTheme;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcERpc3BsYXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdG9vbHRpcERpc3BsYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBNkQ7QUFHN0Q7Ozs7R0FJRztBQUNIO0lBQ0UsSUFBSSxrQkFBa0IsQ0FBQztJQUV2QixJQUFJLHFCQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7UUFDbEMsa0JBQWtCLEdBQUcscUJBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO2FBQzlDLElBQUksQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDO2FBQ3pCLElBQUksQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7S0FDaEM7U0FBTTtRQUNMLGtCQUFrQixHQUFHLHFCQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7S0FDN0M7SUFFRCxPQUFPLGtCQUFrQixDQUFDO0FBQzVCLENBQUM7QUFaRCxzREFZQztBQUVEOztHQUVHO0FBQ0gsa0JBQXlCLGtCQUErRixFQUFFLFdBQTBCO0lBQ2xKLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUMvQyxJQUFNLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQztTQUM3RSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFFckIsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBRTVCLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1NBQzdCLElBQUksQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDO1NBQzVCLElBQUksQ0FBQyxVQUFTLENBQUM7UUFDZCxJQUFNLEdBQUcsR0FBRyxxQkFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FB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