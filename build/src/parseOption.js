"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var formatFieldValue_1 = require("./formatFieldValue");
/**
 * Prepare data for the tooltip
 * @return An array of tooltip data [{ title: ..., value: ...}]
 */
// TODO: add marktype
function getTooltipData(item, options) {
    // ignore the data for group type that represents white space
    if (item.mark.marktype === 'group' && item.mark.name === 'nested_main_group') {
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
        '_id', '_prev', 'width', 'height',
        'count_start', 'count_end',
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
    var tooltipData = [];
    options.fields.forEach(function (fieldOption) {
        // prepare field title
        var title = fieldOption.title ? fieldOption.title : fieldOption.field;
        // get (raw) field value
        var value = getValue(itemData, fieldOption.field);
        if (value === undefined) {
            return undefined;
        }
        // format value
        var formattedValue = formatFieldValue_1.customFormat(value, fieldOption.formatType, fieldOption.format) || formatFieldValue_1.autoFormat(value);
        // add formatted data to tooltipData
        tooltipData.push({ title: title, value: formattedValue });
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
function getValue(itemData, field) {
    var value;
    var accessors = field.split('.');
    // get the first accessor and remove it from the array
    var firstAccessor = accessors[0];
    accessors.shift();
    if (itemData[firstAccessor]) {
        value = itemData[firstAccessor];
        // if we still have accessors, use them to get the value
        accessors.forEach(function (a) {
            if (value[a]) {
                value = value[a];
            }
        });
    }
    if (value === undefined) {
        console.warn('[Tooltip] Cannot find field ' + field + ' in data.');
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
            tooltipData.push({ title: title, value: formattedValue });
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
            var binFieldStart = binFieldRange.concat('_start');
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
            var binRemoveKeys = [];
            binRemoveKeys.push(binFieldStart, binFieldMid, binFieldEnd);
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
                if (value instanceof Date) {
                    quanKeys.push(key);
                }
            }
        }
        removeFields(itemData, quanKeys);
    }
}
exports.dropFieldsForLineArea = dropFieldsForLineArea;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VPcHRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGFyc2VPcHRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1REFBNEQ7QUFHNUQ7OztHQUdHO0FBQ0gscUJBQXFCO0FBQ3JCLHdCQUErQixJQUFnQixFQUFFLE9BQWU7SUFDOUQsNkRBQTZEO0lBQzdELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxLQUFLLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7UUFDN0UsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQsaURBQWlEO0lBQ2pELElBQUksV0FBMEIsQ0FBQztJQUMvQixJQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDcEIsR0FBRyxDQUFDLENBQUMsSUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDL0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RDLENBQUM7SUFDSCxDQUFDO0lBRUQsSUFBTSxVQUFVLEdBQUc7UUFDakIsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUTtRQUNqQyxhQUFhLEVBQUUsV0FBVztRQUMxQixjQUFjLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLFVBQVU7S0FDbEYsQ0FBQztJQUNGLFlBQVksQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFFbkMsd0NBQXdDO0lBQ3hDLHlCQUF5QixDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7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