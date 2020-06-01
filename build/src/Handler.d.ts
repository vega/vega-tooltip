import { TooltipHandler } from 'vega-typings';
import { Options } from './defaults';
/**
 * The tooltip handler class.
 */
export declare class Handler {
    /**
     * The handler function. We bind this to this function in the constructor.
     */
    call: TooltipHandler;
    /**
     * Complete tooltip options.
     */
    private options;
    /**
     * The tooltip html element.
     */
    private el;
    /**
     * Create the tooltip handler and initialize the element and style.
     *
     * @param options Tooltip Options
     */
    constructor(options?: Options);
    /**
     * The tooltip handler function.
     */
    private tooltipHandler;
}
//# sourceMappingURL=Handler.d.ts.map