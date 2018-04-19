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
    else { // if showAllFields is false, only supplement existing fields in options.fields
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
    else { // if not aggregate, just match field name
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
    else { // when user doesn't provide format, supplement format using timeUnit, timeFormat, and numberFormat
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VwcGxlbWVudEZpZWxkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N1cHBsZW1lbnRGaWVsZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhCQUFnQztBQUdoQyxpREFBdUk7QUFDdkksaURBQWtEO0FBR2xELDhDQUE4QztBQUM5QyxJQUFNLGFBQWEsR0FBMEM7SUFDM0QsY0FBYyxFQUFFLFFBQVE7SUFDeEIsVUFBVSxFQUFFLE1BQU07SUFDbEIsU0FBUyxFQUFFLFNBQVM7SUFDcEIsU0FBUyxFQUFFLFNBQVM7Q0FDckIsQ0FBQztBQUVGOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsMkJBQWtDLE9BQWUsRUFBRSxNQUFvQjtJQUNyRSxzQ0FBc0M7SUFDdEMsSUFBTSxrQkFBa0IsR0FBa0IsRUFBRSxDQUFDO0lBQzdDLElBQU0sZ0JBQWdCLEdBQUcsZ0JBQVMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFL0MseUVBQXlFO0lBQ3pFLElBQUksT0FBTyxDQUFDLGFBQWEsS0FBSyxLQUFLLEVBQUU7UUFDbkMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsUUFBdUI7WUFDakUseURBQXlEO1lBQ3pELElBQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRTdELHNEQUFzRDtZQUN0RCxJQUFNLHVCQUF1QixHQUFHLHFCQUFxQixDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1lBRTlHLGtCQUFrQixDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUFDO0tBQ0o7U0FBTSxFQUFFLCtFQUErRTtRQUN0RixJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDbEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxXQUF3QjtnQkFDdkQsMERBQTBEO2dCQUMxRCxJQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7Z0JBRXJFLHNEQUFzRDtnQkFDdEQsSUFBTSx1QkFBdUIsR0FBRyxxQkFBcUIsQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztnQkFFOUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDbkQsQ0FBQyxDQUFDLENBQUM7U0FDSjtLQUNGO0lBRUQsSUFBSSxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDekIsT0FBTyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7S0FDOUI7SUFFRCxPQUFPLENBQUMsTUFBTSxHQUFHLGtCQUFrQixDQUFDO0lBRXBDLE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUM7QUFyQ0QsOENBcUNDO0FBRUQ7Ozs7Ozs7Ozs7R0FVRztBQUNILHdCQUErQixZQUEyQixFQUFFLFFBQXVCO0lBQ2pGLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxZQUFZLElBQUksWUFBWSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7UUFDMUQsT0FBTyxTQUFTLENBQUM7S0FDbEI7SUFFRCx5REFBeUQ7SUFDekQsSUFBSSxRQUFRLENBQUMsU0FBUyxFQUFFO1FBQ3RCLDRFQUE0RTtRQUM1RSxLQUFtQixVQUFZLEVBQVosNkJBQVksRUFBWiwwQkFBWSxFQUFaLElBQVk7WUFBMUIsSUFBTSxJQUFJLHFCQUFBO1lBQ2IsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxRQUFRLENBQUMsU0FBUyxFQUFFO2dCQUMxRSxPQUFPLElBQUksQ0FBQzthQUNiO1NBQ0Y7UUFFRCxzRkFBc0Y7UUFDdEYsS0FBbUIsVUFBWSxFQUFaLDZCQUFZLEVBQVosMEJBQVksRUFBWixJQUFZO1lBQTFCLElBQU0sSUFBSSxxQkFBQTtZQUNiLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxRQUFRLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDcEQsT0FBTyxJQUFJLENBQUM7YUFDYjtTQUNGO1FBRUQseUNBQXlDO1FBQ3pDLE9BQU8sU0FBUyxDQUFDO0tBQ2xCO1NBQU0sRUFBRSwwQ0FBMEM7UUFDakQsS0FBbUIsVUFBWSxFQUFaLDZCQUFZLEVBQVosMEJBQVksRUFBWixJQUFZO1lBQTFCLElBQU0sSUFBSSxxQkFBQTtZQUNiLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxRQUFRLENBQUMsS0FBSyxFQUFFO2dCQUNqQyxPQUFPLElBQUksQ0FBQzthQUNiO1NBQ0Y7UUFFRCx5Q0FBeUM7UUFDekMsT0FBTyxTQUFTLENBQUM7S0FDbEI7QUFDSCxDQUFDO0FBakNELHdDQWlDQztBQUVEOzs7Ozs7Ozs7R0FTRztBQUNILHFCQUE0QixTQUEwQixFQUFFLFdBQXdCO0lBQzlFLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ3BELE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0lBRUQsMkRBQTJEO0lBQzNELEtBQW1CLFVBQVMsRUFBVCx1QkFBUyxFQUFULHVCQUFTLEVBQVQsSUFBUztRQUF2QixJQUFNLElBQUksa0JBQUE7UUFDYixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssV0FBVyxDQUFDLEtBQUssRUFBRTtZQUNwQyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ2xCLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxXQUFXLENBQUMsU0FBUyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRTtvQkFDdEUsT0FBTyxJQUFJLENBQUM7aUJBQ2I7YUFDRjtpQkFBTTtnQkFDTCxPQUFPLElBQUksQ0FBQzthQUNiO1NBQ0Y7S0FDRjtJQUVELHlDQUF5QztJQUN6QyxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBcEJELGtDQW9CQztBQUVEOzs7Ozs7R0FNRztBQUNILCtCQUFzQyxXQUF3QixFQUFFLFFBQXVCLEVBQUUsTUFBbUIsRUFBRSxNQUFzQjtJQUEzQyx1QkFBQSxFQUFBLFdBQW1CO0lBQzFHLHdEQUF3RDtJQUN4RCxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsUUFBUSxFQUFFO1FBQzdCLE9BQU8sQ0FBQyxLQUFLLENBQUMsNkVBQTZFLENBQUMsQ0FBQztRQUM3RixPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUVELGtGQUFrRjtJQUNsRixJQUFJLENBQUMsV0FBVyxJQUFJLFFBQVEsRUFBRTtRQUM1QixXQUFXLEdBQUcsRUFBRSxDQUFDO0tBQ2xCO0lBQ0QsSUFBSSxXQUFXLElBQUksQ0FBQyxRQUFRLEVBQUU7UUFDNUIsUUFBUSxHQUFHLEVBQVMsQ0FBQyxDQUFFLGdEQUFnRDtLQUN4RTtJQUVELGdDQUFnQztJQUNoQyxJQUFNLHVCQUF1QixHQUE0QixFQUFFLENBQUM7SUFFNUQsaUZBQWlGO0lBQ2pGLHNDQUFzQztJQUN0QyxxREFBcUQ7SUFDckQsdURBQXVEO0lBQ3ZELDBHQUEwRztJQUUxRyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUU7UUFDaEIsUUFBUSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0tBQ2xFO0lBQ0QsdUJBQXVCLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUM7SUFFbkYsdUZBQXVGO0lBQ3ZGLHVGQUF1RjtJQUN2Riw4RkFBOEY7SUFDOUYsZ0JBQWdCO0lBQ2hCLDhGQUE4RjtJQUM5Rix3REFBd0Q7SUFDeEQsa0VBQWtFO0lBQ2xFLElBQUksUUFBUSxDQUFDLElBQUksS0FBSyxlQUFRLElBQUksUUFBUSxDQUFDLFFBQVEsRUFBRTtRQUNuRCw2REFBNkQ7UUFDN0QsSUFBTSxxQkFBcUIsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO1FBQzdDLHVCQUF1QixDQUFDLDJCQUEyQixHQUFHLHFCQUFxQixDQUFDO1FBRTVFLHFGQUFxRjtRQUNyRixJQUFNLFNBQVMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1QyxLQUFvQixVQUFTLEVBQVQsdUJBQVMsRUFBVCx1QkFBUyxFQUFULElBQVM7WUFBeEIsSUFBTSxLQUFLLGtCQUFBO1lBQ2QsSUFBSSxLQUFLLENBQUMsS0FBSyxLQUFLLHFCQUFxQixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtnQkFDNUQsdUJBQXVCLENBQUMsMkJBQTJCLEdBQUcsU0FBUyxDQUFDO2dCQUNoRSxNQUFNO2FBQ1A7U0FDRjtLQUNGO0lBRUQsbUJBQW1CO0lBQ25CLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFO1FBQ3RCLE1BQU0sQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsNEJBQTRCO0tBQ3JGO0lBQ0QsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZELElBQUksa0JBQWtCLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDaEMsSUFBSSxRQUFRLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ3hDLFlBQVksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztTQUNwQztLQUNGO0lBQ0QsSUFBSSxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUNoQyxJQUFJLFFBQVEsQ0FBQyxNQUFNLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7WUFDNUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1NBQ3RDO0tBQ0Y7SUFFRCx1QkFBdUIsQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLEtBQUssSUFBSSxZQUFZLENBQUM7SUFFbEUsd0JBQXdCO0lBQ3hCLHVCQUF1QixDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUMsVUFBVSxJQUFJLGFBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFNUYsb0JBQW9CO0lBQ3BCLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRTtRQUN0Qix1QkFBdUIsQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztLQUNyRDtTQUFNLEVBQUUsbUdBQW1HO1FBQzFHLFFBQVEsdUJBQXVCLENBQUMsVUFBVSxFQUFFO1lBQzFDLEtBQUssTUFBTTtnQkFDVCx1QkFBdUIsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNsRCxrRkFBa0Y7b0JBQ2xGLEVBQUUsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQy9FLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQztnQkFDNUQsTUFBTTtZQUNSLEtBQUssUUFBUTtnQkFDWCx1QkFBdUIsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztnQkFDckQsTUFBTTtZQUNSLEtBQUssUUFBUSxDQUFDO1lBQ2QsUUFBUTtTQUNUO0tBQ0Y7SUFFRCxpRkFBaUY7SUFDakYsSUFBSSxRQUFRLENBQUMsR0FBRyxFQUFFO1FBQ2hCLHVCQUF1QixDQUFDLEtBQUssR0FBRyx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLGlCQUFpQjtRQUM1Ryx1QkFBdUIsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ25DLHVCQUF1QixDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsQ0FBQyw0Q0FBNEM7S0FDNUY7SUFFRCxPQUFPLHVCQUF1QixDQUFDO0FBQ2pDLENBQUM7QUFuR0Qsc0RBbUdDO0FBRUQ7O0dBRUc7QUFDSCw0QkFBNEIsRUFBaUI7SUFDM0MsK0VBQStFO0lBQy9FLE9BQU8sTUFBTSxJQUFJLEVBQUUsQ0FBQztBQUN0QixDQUFDO0FBRUQ7O0dBRUc7QUFDSCw0QkFBNEIsRUFBaUI7SUFDM0MsZ0ZBQWdGO0lBQ2hGLE9BQU8sUUFBUSxJQUFJLEVBQUUsQ0FBQztBQUN4QixDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsdUJBQXVCLE1BQW9CO0lBQ3pDLE9BQU8sbUJBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxrQkFBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLGtCQUFXLENBQUMsTUFBTSxDQUFDLElBQUksbUJBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwRyxDQUFDIn0=