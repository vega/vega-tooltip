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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcERpc3BsYXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdG9vbHRpcERpc3BsYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBNkQ7QUFHN0Q7Ozs7R0FJRztBQUNIO0lBQ0UsSUFBSSxrQkFBa0IsQ0FBQztJQUV2QixFQUFFLENBQUMsQ0FBQyxxQkFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuQyxrQkFBa0IsR0FBRyxxQkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7YUFDOUMsSUFBSSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUM7YUFDekIsSUFBSSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixrQkFBa0IsR0FBRyxxQkFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxNQUFNLENBQUMsa0JBQWtCLENBQUM7QUFDNUIsQ0FBQztBQVpELHNEQVlDO0FBRUQ7O0dBRUc7QUFDSCxrQkFBeUIsa0JBQStGLEVBQUUsV0FBMEI7SUFDbEosa0JBQWtCLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQy9DLElBQU0sV0FBVyxHQUFHLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDO1NBQzdFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUVyQixXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7SUFFNUIsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7U0FDN0IsSUFBSSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUM7U0FDNUIsSUFBSSxDQUFDLFVBQVMsQ0FBQztRQUNkLElBQU0s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