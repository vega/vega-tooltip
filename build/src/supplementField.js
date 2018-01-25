"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var vl = require("vega-lite");
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
    // if showAllFields is true or undefined, supplement all fields in vlSpec
    if (options.showAllFields !== false) {
        vl.spec.fieldDefs(vlSpec).forEach(function (fieldDef) {
            // get a fieldOption in options that matches the fieldDef
            var fieldOption = getFieldOption(options.fields, fieldDef);
            // supplement the fieldOption with fieldDef and config
            var supplementedFieldOption = supplementFieldOption(fieldOption, fieldDef, vlSpec);
            supplementedFields.push(supplementedFieldOption);
        });
    }
    else {
        if (options.fields) {
            options.fields.forEach(function (fieldOption) {
                // get the fieldDef in vlSpec that matches the fieldOption
                var fieldDef = getFieldDef(vl.spec.fieldDefs(vlSpec), fieldOption);
                // supplement the fieldOption with fieldDef and config
                var supplementedFieldOption = supplementFieldOption(fieldOption, fieldDef, vlSpec);
                supplementedFields.push(supplementedFieldOption);
            });
        }
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
function supplementFieldOption(fieldOption, fieldDef, vlSpec) {
    // many specs don't have config
    var config = __assign({}, vlSpec.config);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VwcGxlbWVudEZpZWxkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N1cHBsZW1lbnRGaWVsZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsOEJBQWdDO0FBR2hDLGlEQUFrRDtBQUdsRCw4Q0FBOEM7QUFDOUMsSUFBTSxhQUFhLEdBQTBDO0lBQzNELGNBQWMsRUFBRSxRQUFRO0lBQ3hCLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0NBQ3JCLENBQUM7QUFFRjs7Ozs7Ozs7Ozs7R0FXRztBQUNILDJCQUFrQyxPQUFlLEVBQUUsTUFBNEI7SUFDN0Usc0NBQXNDO0lBQ3RDLElBQU0sa0JBQWtCLEdBQWtCLEVBQUUsQ0FBQztJQUU3Qyx5RUFBeUU7SUFDekUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLFFBQXVCO1lBQ2pFLHlEQUF5RDtZQUN6RCxJQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztZQUU3RCxzREFBc0Q7WUFDdEQsSUFBTSx1QkFBdUIsR0FBRyxxQkFBcUIsQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBRXJGLGtCQUFrQixDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDbkIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxXQUF3QjtnQkFDdkQsMERBQTBEO2dC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