import { TopLevelExtendedSpec } from 'vega-lite/build/src/spec';
import { Option, VgView } from './options';
/**
 * Export API for Vega visualizations: vg.tooltip(vgView, options)
 * options can specify whether to show all fields or to show only custom fields
 * It can also provide custom title and format for fields
 */
export declare function vega(vgView: VgView, options?: Option): {
    destroy: () => void;
};
export declare function vegaLite(vgView: VgView, vlSpec: TopLevelExtendedSpec, options?: Option): {
    destroy: () => void;
};
