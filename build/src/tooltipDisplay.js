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
    var row = tooltipRows.enter().append('tr')
        .attr('class', 'tooltip-row');
    row.append('td').attr('class', 'key').text(function (d) { return d.title + ':'; });
    row.append('td').attr('class', 'value').text(function (d) { return d.value; });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcERpc3BsYXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdG9vbHRpcERpc3BsYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBNkQ7QUFHN0Q7Ozs7R0FJRztBQUNIO0lBQ0UsSUFBSSxrQkFBa0IsQ0FBQztJQUV2QixFQUFFLENBQUMsQ0FBQyxxQkFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuQyxrQkFBa0IsR0FBRyxxQkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7YUFDOUMsSUFBSSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUM7YUFDekIsSUFBSSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixrQkFBa0IsR0FBRyxxQkFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxNQUFNLENBQUMsa0JBQWtCLENBQUM7QUFDNUIsQ0FBQztBQVpELHNEQVlDO0FBRUQ7O0dBRUc7QUFDSCxrQkFBeUIsa0JBQStGLEVBQUUsV0FBMEI7SUFDbEosa0JBQWtCLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQy9DLElBQU0sV0FBVyxHQUFHLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDO1NBQzdFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUVyQixXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7SUFFNUIsSUFBTSxHQUFHLEdBQUcsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7U0FDekMsSUFBSSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNoQyxHQUFHLENBQUMs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