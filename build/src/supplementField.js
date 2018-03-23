"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vl = require("vega-lite");
var spec_1 = require("vega-lite/build/src/spec");
var type_1 = require("vega-lite/build/src/type");
/* mapping from fieldDef.type to formatType */
var formatTypeMap = {
    'quantitative': 'number',
    'temporal': 'time',
    'ordinal': undefined,
    'nominal': undefined
};
/**
 * (Vega-Lite only) Supplement options with vlSpec
 *
 * @param options - user-provided options
 * @param vlSpec - vega-lite spec
 * @return the vlSpec-supplemented options object
 *
 * if options.showAllFields is true or undefined, vlSpec will supplement
 * options.fields with all fields in the spec
 * if options.showAllFields is false, vlSpec will only supplement existing fields
 * in options.fields
 */
function supplementOptions(options, vlSpec) {
    // fields to be supplemented by vlSpec
    var supplementedFields = [];
    var normalizedVlSpec = spec_1.normalize(vlSpec, {});
    // if showAllFields is true or undefined, supplement all fields in vlSpec
    if (options.showAllFields !== false) {
        vl.spec.fieldDefs(vlSpec).forEach(function (fieldDef) {
            // get a fieldOption in options that matches the fieldDef
            var fieldOption = getFieldOption(options.fields, fieldDef);
            // supplement the fieldOption with fieldDef and config
            var supplementedFieldOption = supplementFieldOption(fieldOption, fieldDef, vlSpec.config, normalizedVlSpec);
            supplementedFields.push(supplementedFieldOption);
        });
    }
    else {
        if (options.fields) {
            options.fields.forEach(function (fieldOption) {
                // get the fieldDef in vlSpec that matches the fieldOption
                var fieldDef = getFieldDef(vl.spec.fieldDefs(vlSpec), fieldOption);
                // supplement the fieldOption with fieldDef and config
                var supplementedFieldOption = supplementFieldOption(fieldOption, fieldDef, vlSpec.config, normalizedVlSpec);
                supplementedFields.push(supplementedFieldOption);
            });
        }
    }
    if (isComposition(vlSpec)) {
        options.isComposition = true;
    }
    options.fields = supplementedFields;
    return options;
}
exports.supplementOptions = supplementOptions;
/**
 * Find a fieldOption in fieldOptions that matches a fieldDef
 *
 * @param {Object[]} fieldOptionss - a list of field options (i.e. options.fields[])
 * @param {Object} fieldDef - from vlSpec
 * @return the matching fieldOption, or undefined if no match was found
 *
 * If the fieldDef is aggregated, find a fieldOption that matches the field name and
 * the aggregation of the fieldDef.
 * If the fieldDef is not aggregated, find a fieldOption that matches the field name.
 */
function getFieldOption(fieldOptions, fieldDef) {
    if (!fieldDef || !fieldOptions || fieldOptions.length <= 0) {
        return undefined;
    }
    // if aggregate, match field name and aggregate operation
    if (fieldDef.aggregate) {
        // try find the perfect match: field name equals, aggregate operation equals
        for (var _i = 0, fieldOptions_1 = fieldOptions; _i < fieldOptions_1.length; _i++) {
            var item = fieldOptions_1[_i];
            if (item.field === fieldDef.field && item.aggregate === fieldDef.aggregate) {
                return item;
            }
        }
        // try find the second-best match: field name equals, field.aggregate is not specified
        for (var _a = 0, fieldOptions_2 = fieldOptions; _a < fieldOptions_2.length; _a++) {
            var item = fieldOptions_2[_a];
            if (item.field === fieldDef.field && !item.aggregate) {
                return item;
            }
        }
        // return undefined if no match was found
        return undefined;
    }
    else {
        for (var _b = 0, fieldOptions_3 = fieldOptions; _b < fieldOptions_3.length; _b++) {
            var item = fieldOptions_3[_b];
            if (item.field === fieldDef.field) {
                return item;
            }
        }
        // return undefined if no match was found
        return undefined;
    }
}
exports.getFieldOption = getFieldOption;
/**
 * Find a fieldDef that matches a fieldOption
 *
 * @param {Object} fieldOption - a field option (a member in options.fields[])
 * @return the matching fieldDef, or undefined if no match was found
 *
 * A matching fieldDef should have the same field name as fieldOption.
 * If the matching fieldDef is aggregated, the aggregation should not contradict
 * with that of the fieldOption.
 */
function getFieldDef(fieldDefs, fieldOption) {
    if (!fieldOption || !fieldOption.field || !fieldDefs) {
        return undefined;
    }
    // field name should match, aggregation should not disagree
    for (var _i = 0, fieldDefs_1 = fieldDefs; _i < fieldDefs_1.length; _i++) {
        var item = fieldDefs_1[_i];
        if (item.field === fieldOption.field) {
            if (item.aggregate) {
                if (item.aggregate === fieldOption.aggregate || !fieldOption.aggregate) {
                    return item;
                }
            }
            else {
                return item;
            }
        }
    }
    // return undefined if no match was found
    return undefined;
}
exports.getFieldDef = getFieldDef;
/**
 * Supplement a fieldOption (from options.fields[]) with a fieldDef, config
 * (which provides timeFormat, numberFormat, countTitle)
 * Either fieldOption or fieldDef can be undefined, but they cannot both be undefined.
 * config (and its members timeFormat, numberFormat and countTitle) can be undefined.
 * @return the supplemented fieldOption, or undefined on error
 */
function supplementFieldOption(fieldOption, fieldDef, config, vlSpec) {
    if (config === void 0) { config = {}; }
    // at least one of fieldOption and fieldDef should exist
    if (!fieldOption && !fieldDef) {
        console.error('[Tooltip] Cannot supplement a field when field and fieldDef are both empty.');
        return undefined;
    }
    // if either one of fieldOption and fieldDef is undefined, make it an empty object
    if (!fieldOption && fieldDef) {
        fieldOption = {};
    }
    if (fieldOption && !fieldDef) {
        fieldDef = {}; // type will be added later, TODO: refactor this
    }
    // the supplemented field option
    var supplementedFieldOption = {};
    // supplement a user-provided field name with underscore prefixes and suffixes to
    // match the field names in item.datum
    // for aggregation, this will add prefix "mean_" etc.
    // for timeUnit, this will add prefix "yearmonth_" etc.
    // for bin, this will add prefix "bin_" and suffix "_start". Later we will replace "_start" with "_range".
    if (fieldDef.bin) {
        fieldDef.bin = vl.fieldDef.normalizeBin(fieldDef.bin, undefined);
    }
    supplementedFieldOption.field = vl.fieldDef.vgField(fieldDef) || fieldOption.field;
    // If a fieldDef is a (TIMEUNIT)T, we check if the original T is present in the vlSpec.
    // If only (TIMEUNIT)T is present in vlSpec, we set `removeOriginalTemporalField` to T,
    // which will cause function removeDuplicateTimeFields() to remove T and only keep (TIMEUNIT)T
    // in item data.
    // If both (TIMEUNIT)T and T are in vlSpec, we set `removeOriginalTemporalField` to undefined,
    // which will leave both T and (TIMEUNIT)T in item data.
    // Note: user should never have to provide this boolean in options
    if (fieldDef.type === type_1.TEMPORAL && fieldDef.timeUnit) {
        // in most cases, if it's a (TIMEUNIT)T, we remove original T
        var originalTemporalField = fieldDef.field;
        supplementedFieldOption.removeOriginalTemporalField = originalTemporalField;
        // handle corner case: if T is present in vlSpec, then we keep both T and (TIMEUNIT)T
        var fieldDefs = vl.spec.fieldDefs(vlSpec);
        for (var _i = 0, fieldDefs_2 = fieldDefs; _i < fieldDefs_2.length; _i++) {
            var items = fieldDefs_2[_i];
            if (items.field === originalTemporalField && !items.timeUnit) {
                supplementedFieldOption.removeOriginalTemporalField = undefined;
                break;
            }
        }
    }
    // supplement title
    if (!config.countTitle) {
        config.countTitle = vl.config.defaultConfig.countTitle; // use vl default countTitle
    }
    var defaultTitle = vl.fieldDef.title(fieldDef, config);
    if (isPositionFieldDef(fieldDef)) {
        if (fieldDef.axis && fieldDef.axis.title) {
            defaultTitle = fieldDef.axis.title;
        }
    }
    if (isMarkPropFieldDef(fieldDef)) {
        if (fieldDef.legend && fieldDef.legend.title) {
            defaultTitle = fieldDef.legend.title;
        }
    }
    supplementedFieldOption.title = fieldOption.title || defaultTitle;
    // supplement formatType
    supplementedFieldOption.formatType = fieldOption.formatType || formatTypeMap[fieldDef.type];
    // supplement format
    if (fieldOption.format) {
        supplementedFieldOption.format = fieldOption.format;
    }
    else {
        switch (supplementedFieldOption.formatType) {
            case 'time':
                supplementedFieldOption.format = fieldDef.timeUnit ?
                    // TODO(zening): use template for all time fields, to be consistent with Vega-Lite
                    vl.timeUnit.formatExpression(fieldDef.timeUnit, '', false, false).split("'")[1]
                    : config.timeFormat || vl.config.defaultConfig.timeFormat;
                break;
            case 'number':
                supplementedFieldOption.format = config.numberFormat;
                break;
            case 'string':
            default:
        }
    }
    // supplement bin from fieldDef, user should never have to provide bin in options
    if (fieldDef.bin) {
        supplementedFieldOption.field = supplementedFieldOption.field.replace('_start', '_range'); // replace suffix
        supplementedFieldOption.bin = true;
        supplementedFieldOption.formatType = 'string'; // we show bin range as string (e.g. "5-10")
    }
    return supplementedFieldOption;
}
exports.supplementFieldOption = supplementFieldOption;
/**
 * Typeguard function for PositionFieldDef interface
 */
function isPositionFieldDef(fd) {
    // the fieldDef may still be a PositionFieldDef even if it doesn't have an axis
    return 'axis' in fd;
}
/**
 * Typeguard function for MarkPropFieldDef interface
 */
function isMarkPropFieldDef(fd) {
    // the fieldDef may still be a MarkPropFieldDef even if it doesn't have a legend
    return 'legend' in fd;
}
/**
 * Returns true if the spec is composition (one of concat, facet, layer or repeat), false otherwise
 * @param vlSpec Vega-lite spec
 */
function isComposition(vlSpec) {
    return spec_1.isConcatSpec(vlSpec) || spec_1.isFacetSpec(vlSpec) || spec_1.isLayerSpec(vlSpec) || spec_1.isRepeatSpec(vlSpec);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VwcGxlbWVudEZpZWxkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N1cHBsZW1lbnRGaWVsZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhCQUFnQztBQUdoQyxpREFBdUk7QUFDdkksaURBQWtEO0FBR2xELDhDQUE4QztBQUM5QyxJQUFNLGFBQWEsR0FBMEM7SUFDM0QsY0FBYyxFQUFFLFFBQVE7SUFDeEIsVUFBVSxFQUFFLE1BQU07SUFDbEIsU0FBUyxFQUFFLFNBQVM7SUFDcEIsU0FBUyxFQUFFLFNBQVM7Q0FDckIsQ0FBQztBQUVGOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsMkJBQWtDLE9BQWUsRUFBRSxNQUFvQjtJQUNyRSxzQ0FBc0M7SUFDdEMsSUFBTSxrQkFBa0IsR0FBa0IsRUFBRSxDQUFDO0lBQzdDLElBQU0sZ0JBQWdCLEdBQUcsZ0JBQVMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFL0MseUVBQXlFO0lBQ3pFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNwQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxRQUF1QjtZQUNqRSx5REFBeUQ7WUFDekQsSUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFN0Qsc0RBQXNEO1lBQ3RELElBQU0sdUJBQXVCLEdBQUcscUJBQXFCLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsTUFBTSxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFFOUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDbkQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNuQixPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLFdBQXdCO2dCQUN2RCwwREFBMEQ7Z0JBQzFELElBQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFFckUsc0RBQXNEO2dCQUN0RCxJQUFNLHVCQUF1QixHQUFHLHFCQUFxQixDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUU5RyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztZQUNuRCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7SUFDSCxDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixPQUFPLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztJQUMvQixDQUFDO0lBRUQsT0FBTyxDQUFDLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQztJQUVwQyxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQ2pCLENBQUM7QUFyQ0QsOENBcUNDO0FBRUQ7Ozs7Ozs7Ozs7R0FVRztBQUNILHdCQUErQixZQUEyQixFQUFFLFFBQXVCO0lBQ2pGLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsWUFBWSxJQUFJLFlBQVksQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRCxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFRCx5REFBeUQ7SUFDekQsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsNEVBQTRFO1FBQzVFLEdBQUcsQ0FBQyxDQUFlLFVBQVksRUFBWiw2QkFBWSxFQUFaLDBCQUFZLEVBQVosSUFBWTtZQUExQixJQUFNLElBQUkscUJBQUE7WUFDYixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDM0UsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNkLENBQUM7U0FDRjtRQUVELHNGQUFzRjtRQUN0RixHQUFHLENBQUMsQ0FBZSxVQUFZLEVBQVosNkJBQVksRUFBWiwwQkFBWSxFQUFaLElBQVk7WUFBMUIsSUFBTSxJQUFJLHFCQUFBO1lBQ2IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxRQUFRLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JELE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDZCxDQUFDO1NBQ0Y7UUFFRCx5Q0FBeUM7UUFDekMsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixHQUFHLENBQUMsQ0FBZSxVQUFZLEVBQVosNkJBQVksRUFBWiwwQkFBWSxFQUFaLElBQVk7WUFBMUIsSUFBTSxJQUFJLHFCQUFBO1lBQ2IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNkLENBQUM7U0FDRjtRQUVELHlDQUF5QztRQUN6QyxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ25CLENBQUM7QUFDSCxDQUFDO0FBakNELHdDQWlDQztBQUVEOzs7Ozs7Ozs7R0FTRztBQUNILHFCQUE0QixTQUEwQixFQUFFLFdBQXdCO0lBQzlFLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDckQsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQsMkRBQTJEO0lBQzNELEdBQUcsQ0FBQyxDQUFlLFVBQVMsRUFBVCx1QkFBUyxFQUFULHVCQUFTLEVBQVQsSUFBUztRQUF2QixJQUFNLElBQUksa0JBQUE7UUFDYixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxLQUFLLFdBQVcsQ0FBQyxTQUFTLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDdkUsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDZCxDQUFDO1lBQ0gsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDZCxDQUFDO1FBQ0gsQ0FBQztLQUNGO0lBRUQseUNBQXlDO0lBQ3pDLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQXBCRCxrQ0FvQkM7QUFFRDs7Ozs7O0dBTUc7QUFDSCwrQkFBc0MsV0FBd0IsRUFBRSxRQUF1QixFQUFFLE1BQW1CLEVBQUUsTUFBc0I7SUFBM0MsdUJBQUEsRUFBQSxXQUFtQjtJQUMxRyx3REFBd0Q7SUFDeEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzlCLE9BQU8sQ0FBQyxLQUFLLENBQUMsNkVBQTZFLENBQUMsQ0FBQztRQUM3RixNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFRCxrRkFBa0Y7SUFDbEYsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQztRQUM3QixXQUFXLEdBQUcsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFDRCxFQUFFLENBQUMsQ0FBQyxXQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzdCLFFBQVEsR0FBRyxFQUFTLENBQUMsQ0FBRSxnREFBZ0Q7SUFDekUsQ0FBQztJQUVELGdDQUFnQztJQUNoQyxJQUFNLHVCQUF1QixHQUE0QixFQUFFLENBQUM7SUFFNUQsaUZBQWlGO0lBQ2pGLHNDQUFzQztJQUN0QyxxREFBcUQ7SUFDckQsdURBQXVEO0lBQ3ZELDBHQUEwRztJQUUxRyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNqQixRQUFRLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUNELHVCQUF1QixDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDO0lBRW5GLHVGQUF1RjtJQUN2Rix1RkFBdUY7SUFDdkYsOEZBQThGO0lBQzlGLGdCQUFnQjtJQUNoQiw4RkFBOEY7SUFDOUYsd0RBQXdEO0lBQ3hELGtFQUFrRTtJQUNsRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLGVBQVEsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNwRCw2REFBNkQ7UUFDN0QsSUFBTSxxQkFBcUIsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO1FBQzdDLHVCQUF1QixDQUFDLDJCQUEyQixHQUFHLHFCQUFxQixDQUFDO1FBRTVFLHFGQUFxRjtRQUNyRixJQUFNLFNBQVMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1QyxHQUFHLENBQUMsQ0FBZ0IsVUFBUyxFQUFULHVCQUFTLEVBQVQsdUJBQVMsRUFBVCxJQUFTO1lBQXhCLElBQU0sS0FBSyxrQkFBQTtZQUNkLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEtBQUsscUJBQXFCLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDN0QsdUJBQXVCLENBQUMsMkJBQTJCLEdBQUcsU0FBUyxDQUFDO2dCQUNoRSxLQUFLLENBQUM7WUFDUixDQUFDO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsbUJBQW1CO0lBQ25CLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDdkIsTUFBTSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyw0QkFBNEI7SUFDdEYsQ0FBQztJQUNELElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN2RCxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDekMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3JDLENBQUM7SUFDSCxDQUFDO0lBQ0QsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzdDLFlBQVksR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUN2QyxDQUFDO0lBQ0gsQ0FBQztJQUVELHVCQUF1QixDQUFDLEtBQUssR0FBRyxXQUFXLENBQUMsS0FBSyxJQUFJLFlBQVksQ0FBQztJQUVsRSx3QkFBd0I7SUFDeEIsdUJBQXVCLENBQUMsVUFBVSxHQUFHLFdBQVcsQ0FBQyxVQUFVLElBQUksYUFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUU1RixvQkFBb0I7SUFDcEIsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDdkIsdUJBQXVCLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7SUFDdEQsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sTUFBTSxDQUFDLENBQUMsdUJBQXVCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUMzQyxLQUFLLE1BQU07Z0JBQ1QsdUJBQXVCLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDbEQsa0ZBQWtGO29CQUNsRixFQUFFLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMvRSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUM7Z0JBQzVELEtBQUssQ0FBQztZQUNSLEtBQUssUUFBUTtnQkFDWCx1QkFBdUIsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztnQkFDckQsS0FBSyxDQUFDO1lBQ1IsS0FBSyxRQUFRLENBQUM7WUFDZCxRQUFRO1FBQ1YsQ0FBQztJQUNILENBQUM7SUFFRCxpRkFBaUY7SUFDakYsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDakIsdUJBQXVCLENBQUMsS0FBSyxHQUFHLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsaUJBQWlCO1FBQzVHLHVCQUF1QixDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFDbkMsdUJBQXVCLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxDQUFDLDRDQUE0QztJQUM3RixDQUFDO0lBRUQsTUFBTSxDQUFDLHVCQUF1QixDQUFDO0FBQ2pDLENBQUM7QUFuR0Qsc0RBbUdDO0FBRUQ7O0dBRUc7QUFDSCw0QkFBNEIsRUFBaUI7SUFDM0MsK0VBQStFO0lBQy9FLE1BQU0sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO0FBQ3RCLENBQUM7QUFFRDs7R0FFRztBQUNILDRCQUE0QixFQUFpQjtJQUMzQyxnRkFBZ0Y7SUFDaEYsTUFBTSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUM7QUFDeEIsQ0FBQztBQUVEOzs7R0FHRztBQUNILHVCQUF1QixNQUFvQjtJQUN6QyxNQUFNLENBQUMsbUJBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxrQkFBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLGtCQUFXLENBQUMsTUFBTSxDQUFDLElBQUksbUJBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwRyxDQUFDIn0=