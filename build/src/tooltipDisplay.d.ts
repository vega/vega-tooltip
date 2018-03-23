import { EnterElement, Selection } from 'd3-selection';
import { Option, TooltipData } from './options';
/**
 * Get the tooltip HTML placeholder by id selector "#vis-tooltip"
 * If none exists, create a placeholder.
 * @returns the HTML placeholder for tooltip
 */
export declare function getTooltipPlaceholder(): any;
/**
 * Bind tooltipData to the tooltip placeholder
 */
export declare function bindData(tooltipPlaceholder: Selection<Element | EnterElement | Document | Window, {}, HTMLElement, any>, tooltipData: TooltipData[]): void;
/**
 * Clear tooltip data
 */
export declare function clearData(): void;
/**
 * Update tooltip position
 * Default position is 10px right of and 10px below the cursor. This can be
 * overwritten by options.offset
 */
export declare function updatePosition(event: MouseEvent, options: Option): void;
export declare function clearPosition(): void;
/**
 * Update tooltip color theme according to options.colorTheme
 *
 * If colorTheme === "dark", apply dark theme to tooltip.
 * Otherwise apply light color theme.
 */
export declare function updateColorTheme(options: Option): void;
export declare function clearColorTheme(): void;
