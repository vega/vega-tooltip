import {EnterElement, select, Selection} from 'd3-selection';
import {Option, TooltipData} from './options';

/**
 * Get the tooltip HTML placeholder by id selector "#vis-tooltip"
 * If none exists, create a placeholder.
 * @returns the HTML placeholder for tooltip
 */
export function getTooltipPlaceholder() {
  let tooltipPlaceholder;

  if (select('#vis-tooltip').empty()) {
    tooltipPlaceholder = select('body').append('div')
      .attr('id', 'vis-tooltip')
      .attr('class', 'vg-tooltip');
  } else {
    tooltipPlaceholder = select('#vis-tooltip');
  }

  return tooltipPlaceholder;
}

/**
 * Bind tooltipData to the tooltip placeholder
 */
export function bindData(tooltipPlaceholder: Selection<Element | EnterElement | Document | Window, {}, HTMLElement, any>, tooltipData: TooltipData[]) {
  tooltipPlaceholder.selectAll('table').remove();
  const tooltipRows = tooltipPlaceholder.append('table').selectAll('.tooltip-row')
    .data(tooltipData);

  tooltipRows.exit().remove();

  const row = tooltipRows.enter().append('tr')
    .attr('class', 'tooltip-row');
  row.append('td').attr('class', 'key').text(function (d: TooltipData) { return d.title + ':'; });
  row.append('td').attr('class', 'value').text(function (d: TooltipData) { return d.value; });
}

/**
 * Clear tooltip data
 */
export function clearData() {
  select('#vis-tooltip').selectAll('.tooltip-row').data([])
    .exit().remove();
}

/**
 * Update tooltip position
 * Default position is 10px right of and 10px below the cursor. This can be
 * overwritten by options.offset
 */
export function updatePosition(event: MouseEvent, options: Option) {
  // determine x and y offsets, defaults are 10px
  let offsetX = 10;
  let offsetY = 10;
  if (options && options.offset && (options.offset.x !== undefined) && (options.offset.x !== null)) {
    offsetX = options.offset.x;
  }
  if (options && options.offset && (options.offset.y !== undefined) && (options.offset.y !== null)) {
    offsetY = options.offset.y;
  }

  // TODO: use the correct time type
  select('#vis-tooltip')
    .style('top', function (this: HTMLElement) {
      // by default: put tooltip 10px below cursor
      // if tooltip is close to the bottom of the window, put tooltip 10px above cursor
      const tooltipHeight = this.getBoundingClientRect().height;
      if (event.clientY + tooltipHeight + offsetY < window.innerHeight) {
        return '' + (event.clientY + offsetY) + 'px';
      } else {
        return '' + (event.clientY - tooltipHeight - offsetY) + 'px';
      }
    })
    .style('left', function (this: HTMLElement) {
      // by default: put tooltip 10px to the right of cursor
      // if tooltip is close to the right edge of the window, put tooltip 10 px to the left of cursor
      const tooltipWidth = this.getBoundingClientRect().width;
      if (event.clientX + tooltipWidth + offsetX < window.innerWidth) {
        return '' + (event.clientX + offsetX) + 'px';
      } else {
        return '' + (event.clientX - tooltipWidth - offsetX) + 'px';
      }
    });
}

/* Clear tooltip position */
export function clearPosition() {
  select('#vis-tooltip')
    .style('top', '-9999px')
    .style('left', '-9999px');
}

/**
 * Update tooltip color theme according to options.colorTheme
 *
 * If colorTheme === "dark", apply dark theme to tooltip.
 * Otherwise apply light color theme.
 */
export function updateColorTheme(options: Option) {
  clearColorTheme();

  if (options && options.colorTheme === 'dark') {
    select('#vis-tooltip').classed('dark-theme', true);
  } else {
    select('#vis-tooltip').classed('light-theme', true);
  }
}

/* Clear color themes */
export function clearColorTheme() {
  select('#vis-tooltip').classed('dark-theme light-theme', false);
}
