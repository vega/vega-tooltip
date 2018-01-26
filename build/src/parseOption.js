"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            value = value;
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
                if (value instanceof Date) {
                    quanKeys.push(key);
                }
            }
        }
        removeFields(itemData, quanKeys);
    }
}
exports.dropFieldsForLineArea = dropFieldsForLineArea;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VPcHRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGFyc2VPcHRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1REFBNEQ7QUFHNUQ7OztHQUdHO0FBQ0gscUJBQXFCO0FBQ3JCLHdCQUErQixJQUFnQixFQUFFLE9BQWU7SUFDOUQsK0JBQStCO0lBQy9CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDbkMsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQsaURBQWlEO0lBQ2pELElBQUksV0FBMEIsQ0FBQztJQUMvQixJQUFNLFFBQVEsR0FBbUIsRUFBRSxDQUFDO0lBQ3BDLEdBQUcsQ0FBQyxDQUFDLElBQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQy9CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QyxDQUFDO0lBQ0gsQ0FBQztJQUVELElBQU0sVUFBVSxHQUFHO1FBQ2pCLE9BQU8sRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLFdBQVc7UUFDN0MsY0FBYyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxVQUFVO0tBQ2xGLENBQUM7SUFDRixZQUFZLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBRW5DLHdDQUF3QztJQUN4Qyx5QkFBeUIsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXBELDREQUE0RDtJQUM1RCxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxD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