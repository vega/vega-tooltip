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
        fieldDef = {};
    }
    // the supplemented field option
    var supplementedFieldOption = {};
    // supplement a user-provided field name with underscore prefixes and suffixes to
    // match the field names in item.datum
    // for aggregation, this will add prefix "mean_" etc.
    // for timeUnit, this will add prefix "yearmonth_" etc.
    // for bin, this will add prefix "bin_" and suffix "_start". Later we will replace "_start" with "_range".
    supplementedFieldOption.field = fieldDef.field ?
        vl.fieldDef.field(fieldDef) : fieldOption.field;
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
    supplementedFieldOption.title = fieldOption.title ?
        fieldOption.title : vl.fieldDef.title(fieldDef, config);
    // supplement formatType
    supplementedFieldOption.formatType = fieldOption.formatType ?
        fieldOption.formatType : formatTypeMap[fieldDef.type];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VwcGxlbWVudEZpZWxkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N1cHBsZW1lbnRGaWVsZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsOEJBQWdDO0FBR2hDLGlEQUFrRDtBQUdsRCw4Q0FBOEM7QUFDOUMsSUFBTSxhQUFhLEdBQTBDO0lBQzNELGNBQWMsRUFBRSxRQUFRO0lBQ3hCLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0NBQ3JCLENBQUM7QUFFRjs7Ozs7Ozs7Ozs7R0FXRztBQUNILDJCQUFrQyxPQUFlLEVBQUUsTUFBNEI7SUFDN0Usc0NBQXNDO0lBQ3RDLElBQU0sa0JBQWtCLEdBQWtCLEVBQUUsQ0FBQztJQUU3Qyx5RUFBeUU7SUFDekUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLFFBQTBCO1lBQ3BFLHlEQUF5RDtZQUN6RCxJQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztZQUU3RCxzREFBc0Q7WUFDdEQsSUFBTSx1QkFBdUIsR0FBRyxxQkFBcUIsQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBRXJGLGtCQUFrQixDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDbkIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxXQUF3QjtnQkFDdkQsMERBQTBEO2dC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