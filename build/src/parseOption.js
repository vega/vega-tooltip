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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VPcHRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGFyc2VPcHRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1REFBNEQ7QUFHNUQ7OztHQUdHO0FBQ0gscUJBQXFCO0FBQ3JCLHdCQUErQixJQUFnQixFQUFFLE9BQWU7SUFDOUQsK0JBQStCO0lBQy9CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDbkMsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQsaURBQWlEO0lBQ2pELElBQUksV0FBMEIsQ0FBQztJQUMvQixJQUFNLFFBQVEsR0FBbUIsRUFBRSxDQUFDO0lBQ3BDLEdBQUcsQ0FBQyxDQUFDLElBQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQy9CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QyxDQUFDO0lBQ0gsQ0FBQztJQUVELElBQU0sVUFBVSxHQUFHO1FBQ2pCLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFFBQVE7UUFDakMsYUFBYSxFQUFFLFdBQVc7UUFDMUIsY0FBYyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxVQUFVO0tBQ2xGLENBQUM7SUFDRixZQUFZLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBRW5DLHdDQUF3QztJQUN4Qyx5QkFBeUIsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXBELDREQUE0RDtJQUM1RCxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUs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