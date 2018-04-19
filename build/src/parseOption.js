"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_util_1 = require("vega-util");
var formatFieldValue_1 = require("./formatFieldValue");
/**
 * Prepare data for the tooltip
 * @return An array of tooltip data [{ title: ..., value: ...}]
 */
// TODO: add marktype
function getTooltipData(item, options) {
    // ignore data from group marks
    if (item.mark.marktype === 'group') {
        return undefined;
    }
    // this array will be bind to the tooltip element
    var tooltipData;
    var itemData = {};
    for (var field in item.datum) {
        if (item.datum.hasOwnProperty(field)) {
            itemData[field] = item.datum[field];
        }
    }
    var removeKeys = [
        'width', 'height', 'count_start', 'count_end',
        'layout_start', 'layout_mid', 'layout_end', 'layout_path', 'layout_x', 'layout_y'
    ];
    removeFields(itemData, removeKeys);
    // remove duplicate time fields (if any)
    removeDuplicateTimeFields(itemData, options.fields);
    // combine multiple rows of a binned field into a single row
    combineBinFields(itemData, options.fields);
    // TODO(zening): use Vega-Lite layering to support tooltip on line and area charts (#1)
    dropFieldsForLineArea(item.mark.marktype, itemData);
    if (options.showAllFields === true) {
        tooltipData = prepareAllFieldsData(itemData, options);
    }
    else {
        tooltipData = prepareCustomFieldsData(itemData, options);
    }
    if (options.sort) {
        var sortStr = options.sort === 'title' ? 'title' :
            options.sort === 'value' ? 'rawValue' :
                null;
        var sortFn = sortStr ? defaultSort(sortStr) : vega_util_1.isFunction(options.sort) && options.sort;
        if (sortFn) {
            tooltipData = tooltipData.sort(sortFn);
        }
    }
    return tooltipData;
}
exports.getTooltipData = getTooltipData;
/**
 * Prepare custom fields data for tooltip. This function formats
 * field titles and values and returns an array of formatted fields.
 *
 * @param {time.map} itemData - a map of item.datum
 * @param {Object} options - user-provided options
 * @return An array of formatted fields specified by options [{ title: ..., value: ...}]
 */
function prepareCustomFieldsData(itemData, options) {
    if (options === void 0) { options = {}; }
    var tooltipData = [];
    options.fields.forEach(function (fieldOption) {
        var titleStr = vega_util_1.isString(fieldOption.title) ? fieldOption.title : undefined;
        var titleFn = vega_util_1.isFunction(fieldOption.title) ? fieldOption.title : undefined;
        // prepare field title
        var title = (titleFn && titleFn(itemData)) ||
            titleStr ||
            fieldOption.field;
        // get (raw) field value
        var value = (fieldOption.valueAccessor && fieldOption.valueAccessor(itemData)) ||
            getValue(itemData, fieldOption.field, options.isComposition);
        if (value === undefined) {
            return undefined;
        }
        // format value
        var formattedValue = formatFieldValue_1.customFormat(value, fieldOption.formatType, fieldOption.format) || formatFieldValue_1.autoFormat(value);
        // add formatted data to tooltipData
        tooltipData.push({
            title: title,
            value: formattedValue,
            rawValue: value,
            render: fieldOption.render
        });
    });
    return tooltipData;
}
exports.prepareCustomFieldsData = prepareCustomFieldsData;
/**
 * Get a field value from a data map.
 * @param {time.map} itemData - a map of item.datum
 * @param {string} field - the name of the field. It can contain "." to specify
 * that the field is not a direct child of item.datum
 * @return the field value on success, undefined otherwise
 */
// TODO(zening): Mute "Cannot find field" warnings for composite vis (issue #39)
function getValue(itemData, field, isComposition) {
    var value;
    var accessors = field.split('.');
    // get the first accessor and remove it from the array
    var firstAccessor = accessors[0];
    accessors.shift();
    if (itemData[firstAccessor]) {
        value = itemData[firstAccessor];
        // if we still have accessors, use them to get the value
        accessors.forEach(function (a) {
            value = value;
            if (value[a]) {
                value = value[a];
            }
        });
    }
    if (value === undefined) {
        if (!isComposition) {
            console.warn('[Tooltip] Cannot find field ' + field + ' in data.');
        }
        return undefined;
    }
    else {
        return value;
    }
}
exports.getValue = getValue;
/**
 * Prepare data for all fields in itemData for tooltip. This function
 * formats field titles and values and returns an array of formatted fields.
 *
 * @param {time.map} itemData - a map of item.datum
 * @param {Object} options - user-provided options
 * @return All fields in itemData, formatted, in the form of an array: [{ title: ..., value: ...}]
 *
 * Please note that this function expects itemData to be simple {field:value} pairs.
 * It will not try to parse value if it is an object. If value is an object, please
 * use prepareCustomFieldsData() instead.
 */
function prepareAllFieldsData(itemData, options) {
    if (options === void 0) { options = {}; }
    var tooltipData = [];
    // here, fieldOptions still provides format
    var fieldOptions = {};
    if (options && options.fields) {
        for (var _i = 0, _a = options.fields; _i < _a.length; _i++) {
            var optionField = _a[_i];
            fieldOptions[optionField.field] = optionField;
        }
    }
    for (var field in itemData) {
        if (itemData.hasOwnProperty(field)) {
            var value = itemData[field];
            var title = void 0;
            if (fieldOptions[field] && fieldOptions[field].title) {
                title = fieldOptions[field].title;
            }
            else {
                title = field;
            }
            var formatType = void 0;
            var format = void 0;
            // format value
            if (fieldOptions[field]) {
                formatType = fieldOptions[field].formatType;
                format = fieldOptions[field].format;
            }
            var formattedValue = formatFieldValue_1.customFormat(value, formatType, format) || formatFieldValue_1.autoFormat(value);
            // add formatted data to tooltipData
            tooltipData.push({ title: title, value: formattedValue, rawValue: value });
        }
    }
    return tooltipData;
}
exports.prepareAllFieldsData = prepareAllFieldsData;
/**
 * Remove multiple fields from a tooltip data map, using removeKeys
 *
 * Certain meta data fields (e.g. "_id", "_prev") should be hidden in the tooltip
 * by default. This function can be used to remove these fields from tooltip data.
 * @param {time.map} dataMap - the data map that contains tooltip data.
 * @param {string[]} removeKeys - the fields that should be removed from dataMap.
 */
function removeFields(dataMap, removeKeys) {
    removeKeys.forEach(function (key) {
        delete dataMap[key];
    });
}
exports.removeFields = removeFields;
/**
 * When a temporal field has timeUnit, itemData will give us duplicated fields
 * (e.g., Year and YEAR(Year)). In tooltip want to display the field WITH the
 * timeUnit and remove the field that doesn't have timeUnit.
 */
function removeDuplicateTimeFields(itemData, optFields) {
    if (!optFields) {
        return undefined;
    }
    optFields.forEach(function (optField) {
        if (optField.removeOriginalTemporalField) {
            removeFields(itemData, [optField.removeOriginalTemporalField]);
        }
    });
}
exports.removeDuplicateTimeFields = removeDuplicateTimeFields;
/**
 * Combine multiple binned fields in itemData into one field. The value of the field
 * is a string that describes the bin range.
 *
 * @param {Object} itemData - an object of item.datum
 * @param {Object[]} fieldOptions - a list of field options (i.e. options.fields[])
 * @return itemData with combined bin fields
 */
function combineBinFields(itemData, fieldOptions) {
    if (!fieldOptions) {
        return undefined;
    }
    fieldOptions.forEach(function (fieldOption) {
        if (fieldOption.bin === true) {
            // get binned field names
            var binFieldRange = fieldOption.field;
            var binFieldStart = binFieldRange;
            var binFieldMid = binFieldRange.concat('_mid');
            var binFieldEnd = binFieldRange.concat('_end');
            // use start value and end value to compute range
            // save the computed range in binFieldStart
            var startValue = itemData[binFieldStart];
            var endValue = itemData[binFieldEnd];
            if ((startValue !== undefined) && (endValue !== undefined)) {
                var range = startValue + '-' + endValue;
                itemData[binFieldRange] = range;
            }
            // remove binFieldMid, binFieldEnd, and binFieldRange from itemData
            var binRemoveKeys = [binFieldMid, binFieldEnd];
            removeFields(itemData, binRemoveKeys);
        }
    });
    return itemData;
}
exports.combineBinFields = combineBinFields;
/**
 * Drop fields for line and area marks.
 *
 * Lines and areas are defined by a series of datum. We overlay point marks
 * on top of lines and areas to allow tooltip to show all data in the series.
 * For the line marks and area marks underneath, we only show nominal fields
 * in tooltip. This is because line / area marks only give us the last datum
 * in their series. It only make sense to show the nominal fields (e.g., symbol
 * = APPL, AMZN, GOOG, IBM, MSFT) because these fields don't tend to change along
 * the line / area border.
 */
function dropFieldsForLineArea(marktype, itemData) {
    if (marktype === 'line' || marktype === 'area') {
        var quanKeys = [];
        for (var key in itemData) {
            if (itemData.hasOwnProperty(key)) {
                var value = itemData[key];
                if (vega_util_1.isDate(value)) {
                    quanKeys.push(key);
                }
            }
        }
        removeFields(itemData, quanKeys);
    }
}
exports.dropFieldsForLineArea = dropFieldsForLineArea;
function defaultSort(field) {
    return function (a, b) {
        if (vega_util_1.isNumber(a[field]) && vega_util_1.isNumber(b[field])) {
            // numeric comparison: descending
            return b[field] - a[field];
        }
        else if (vega_util_1.isString(a[field]) && vega_util_1.isString(b[field])) {
            // string comparison: ascending
            return a[field].localeCompare(b[field]);
        }
        else if (vega_util_1.isDate(a[field]) && vega_util_1.isDate(b[field])) {
            // date comparison; ascending
            return a[field] - b[field];
        }
        // dates first
        if (vega_util_1.isDate(a[field])) {
            return -1;
        }
        if (vega_util_1.isDate(b[field])) {
            return 1;
        }
        // numbers second
        if (vega_util_1.isNumber(a[field])) {
            return -1;
        }
        if (vega_util_1.isNumber(b[field])) {
            return 1;
        }
        // strings last
        return 1;
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VPcHRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGFyc2VPcHRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1Q0FBaUU7QUFDakUsdURBQTREO0FBRzVEOzs7R0FHRztBQUNILHFCQUFxQjtBQUNyQix3QkFBK0IsSUFBZ0IsRUFBRSxPQUFlO0lBQzlELCtCQUErQjtJQUMvQixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxLQUFLLE9BQU8sRUFBRTtRQUNsQyxPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUVELGlEQUFpRDtJQUNqRCxJQUFJLFdBQTBCLENBQUM7SUFDL0IsSUFBTSxRQUFRLEdBQW1CLEVBQUUsQ0FBQztJQUNwQyxLQUFLLElBQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFDOUIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNwQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNyQztLQUNGO0lBRUQsSUFBTSxVQUFVLEdBQUc7UUFDakIsT0FBTyxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsV0FBVztRQUM3QyxjQUFjLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLFVBQVU7S0FDbEYsQ0FBQztJQUNGLFlBQVksQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFFbkMsd0NBQXdDO0lBQ3hDLHlCQUF5QixDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFcEQsNERBQTREO0lBQzVELGdCQUFnQixDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFM0MsdUZBQXVGO0lBQ3ZGLHFCQUFxQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFFB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