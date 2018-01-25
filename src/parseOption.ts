import {autoFormat, customFormat} from './formatFieldValue';
import {FieldOption, Option, Scenegraph, ScenegraphData, SupplementedFieldOption, TemporaryFieldOption, TooltipData} from './options';

/**
 * Prepare data for the tooltip
 * @return An array of tooltip data [{ title: ..., value: ...}]
 */
// TODO: add marktype
export function getTooltipData(item: Scenegraph, options: Option) {
  // ignore data from group marks
  if (item.mark.marktype === 'group') {
    return undefined;
  }

  // this array will be bind to the tooltip element
  let tooltipData: TooltipData[];
  const itemData: ScenegraphData = {};
  for (const field in item.datum) {
    if (item.datum.hasOwnProperty(field)) {
      itemData[field] = item.datum[field];
    }
  }

  const removeKeys = [
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
  } else {
    tooltipData = prepareCustomFieldsData(itemData, options);
  }
  return tooltipData;
}

/**
 * Prepare custom fields data for tooltip. This function formats
 * field titles and values and returns an array of formatted fields.
 *
 * @param {time.map} itemData - a map of item.datum
 * @param {Object} options - user-provided options
 * @return An array of formatted fields specified by options [{ title: ..., value: ...}]
 */
export function prepareCustomFieldsData(itemData: ScenegraphData, options: Option = {}) {
  const tooltipData: TooltipData[] = [];

  options.fields.forEach(function (fieldOption) {
    // prepare field title
    const title = fieldOption.title ? fieldOption.title : fieldOption.field;

    // get (raw) field value
    const value = getValue(itemData, fieldOption.field);
    if (value === undefined) {
      return undefined;
    }

    // format value
    const formattedValue = customFormat(value, fieldOption.formatType, fieldOption.format) || autoFormat(value);

    // add formatted data to tooltipData
    tooltipData.push({title: title, value: formattedValue});
  });

  return tooltipData;
}

/**
 * Get a field value from a data map.
 * @param {time.map} itemData - a map of item.datum
 * @param {string} field - the name of the field. It can contain "." to specify
 * that the field is not a direct child of item.datum
 * @return the field value on success, undefined otherwise
 */
// TODO(zening): Mute "Cannot find field" warnings for composite vis (issue #39)
export function getValue(itemData: ScenegraphData, field: string) {
  let value: string | number | Date | ScenegraphData;

  const accessors: string[] = field.split('.');

  // get the first accessor and remove it from the array
  const firstAccessor: string = accessors[0];
  accessors.shift();
  if (itemData[firstAccessor]) {
    value = itemData[firstAccessor];

    // if we still have accessors, use them to get the value
    accessors.forEach(function (a) {
      value = value as ScenegraphData;
      if (value[a]) {
        value = value[a];
      }
    });
  }

  if (value === undefined) {
    console.warn('[Tooltip] Cannot find field ' + field + ' in data.');
    return undefined;
  } else {
    return value as string | number | Date;
  }
}


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
export function prepareAllFieldsData(itemData: ScenegraphData, options: Option = {}) {
  const tooltipData: TooltipData[] = [];

  // here, fieldOptions still provides format
  const fieldOptions: TemporaryFieldOption = {};
  if (options && options.fields) {
    for (const optionField of options.fields) {
      fieldOptions[optionField.field] = optionField;
    }
  }

  for (const field in itemData) {
    if (itemData.hasOwnProperty(field)) {
      const value = itemData[field] as number | string | Date;
      let title;
      if (fieldOptions[field] && fieldOptions[field].title) {
        title = fieldOptions[field].title;
      } else {
        title = field;
      }

      let formatType;
      let format;
      // format value
      if (fieldOptions[field]) {
        formatType = fieldOptions[field].formatType;
        format = fieldOptions[field].format;
      }
      const formattedValue = customFormat(value, formatType, format) || autoFormat(value);

      // add formatted data to tooltipData
      tooltipData.push({title: title, value: formattedValue});
    }
  }
  return tooltipData;
}

/**
 * Remove multiple fields from a tooltip data map, using removeKeys
 *
 * Certain meta data fields (e.g. "_id", "_prev") should be hidden in the tooltip
 * by default. This function can be used to remove these fields from tooltip data.
 * @param {time.map} dataMap - the data map that contains tooltip data.
 * @param {string[]} removeKeys - the fields that should be removed from dataMap.
 */
export function removeFields(dataMap: ScenegraphData, removeKeys: string[]) {
  removeKeys.forEach(function (key) {
    delete dataMap[key];
  });
}

/**
 * When a temporal field has timeUnit, itemData will give us duplicated fields
 * (e.g., Year and YEAR(Year)). In tooltip want to display the field WITH the
 * timeUnit and remove the field that doesn't have timeUnit.
 */
export function removeDuplicateTimeFields(itemData: ScenegraphData, optFields: SupplementedFieldOption[]): void {
  if (!optFields) {
    return undefined;
  }

  optFields.forEach(function (optField) {
    if (optField.removeOriginalTemporalField) {
      removeFields(itemData, [optField.removeOriginalTemporalField]);
    }
  });
}

/**
 * Combine multiple binned fields in itemData into one field. The value of the field
 * is a string that describes the bin range.
 *
 * @param {Object} itemData - an object of item.datum
 * @param {Object[]} fieldOptions - a list of field options (i.e. options.fields[])
 * @return itemData with combined bin fields
 */
export function combineBinFields(itemData: ScenegraphData, fieldOptions: FieldOption[]) {
  if (!fieldOptions) {
    return undefined;
  }

  fieldOptions.forEach(function (fieldOption) {
    if (fieldOption.bin === true) {
      // get binned field names
      const binFieldRange = fieldOption.field;
      const binFieldStart = binFieldRange;
      const binFieldMid = binFieldRange.concat('_mid');
      const binFieldEnd = binFieldRange.concat('_end');

      // use start value and end value to compute range
      // save the computed range in binFieldStart
      const startValue = itemData[binFieldStart];
      const endValue = itemData[binFieldEnd];
      if ((startValue !== undefined) && (endValue !== undefined)) {
        const range = startValue + '-' + endValue;
        itemData[binFieldRange] = range;
      }

      // remove binFieldMid, binFieldEnd, and binFieldRange from itemData
      const binRemoveKeys = [binFieldMid, binFieldEnd];
      removeFields(itemData, binRemoveKeys);
    }
  });

  return itemData;
}

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
export function dropFieldsForLineArea(marktype: string, itemData: ScenegraphData) {
  if (marktype === 'line' || marktype === 'area') {
    const quanKeys: string[] = [];
    for (const key in itemData) {
      if (itemData.hasOwnProperty(key)) {
        const value = itemData[key];
        if (value instanceof Date) {
          quanKeys.push(key);
        }
      }
    }
    removeFields(itemData, quanKeys);
  }
}
