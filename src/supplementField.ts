import * as vl from 'vega-lite';
import {FieldDef} from 'vega-lite/build/src/fielddef';
import {TopLevelExtendedSpec} from 'vega-lite/build/src/spec';
import {TEMPORAL} from 'vega-lite/build/src/type';
import {FieldOption, Option, SupplementedFieldOption} from './options';

/* mapping from fieldDef.type to formatType */
const formatTypeMap: { [type: string]: 'number' | 'time' } = {
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
export function supplementOptions(options: Option, vlSpec: TopLevelExtendedSpec) {
  // fields to be supplemented by vlSpec
  const supplementedFields: FieldOption[] = [];

  // if showAllFields is true or undefined, supplement all fields in vlSpec
  if (options.showAllFields !== false) {
    vl.spec.fieldDefs(vlSpec).forEach(function (fieldDef: FieldDef<string>) {
      // get a fieldOption in options that matches the fieldDef
      const fieldOption = getFieldOption(options.fields, fieldDef);

      // supplement the fieldOption with fieldDef and config
      const supplementedFieldOption = supplementFieldOption(fieldOption, fieldDef, vlSpec);

      supplementedFields.push(supplementedFieldOption);
    });
  } else { // if showAllFields is false, only supplement existing fields in options.fields
    if (options.fields) {
      options.fields.forEach(function (fieldOption: FieldOption) {
        // get the fieldDef in vlSpec that matches the fieldOption
        const fieldDef = getFieldDef(vl.spec.fieldDefs(vlSpec) as FieldDef<string>[], fieldOption);

        // supplement the fieldOption with fieldDef and config
        const supplementedFieldOption = supplementFieldOption(fieldOption, fieldDef, vlSpec);

        supplementedFields.push(supplementedFieldOption);
      });
    }
  }

  options.fields = supplementedFields;

  return options;
}

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
export function getFieldOption(fieldOptions: FieldOption[], fieldDef: FieldDef<string>) {
  if (!fieldDef || !fieldOptions || fieldOptions.length <= 0) {
    return undefined;
  }

  // if aggregate, match field name and aggregate operation
  if (fieldDef.aggregate) {
    // try find the perfect match: field name equals, aggregate operation equals
    for (const item of fieldOptions) {
      if (item.field === fieldDef.field && item.aggregate === fieldDef.aggregate) {
        return item;
      }
    }

    // try find the second-best match: field name equals, field.aggregate is not specified
    for (const item of fieldOptions) {
      if (item.field === fieldDef.field && !item.aggregate) {
        return item;
      }
    }

    // return undefined if no match was found
    return undefined;
  } else { // if not aggregate, just match field name
    for (const item of fieldOptions) {
      if (item.field === fieldDef.field) {
        return item;
      }
    }

    // return undefined if no match was found
    return undefined;
  }
}

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
export function getFieldDef(fieldDefs: FieldDef<string>[], fieldOption: FieldOption): FieldDef<string> {
  if (!fieldOption || !fieldOption.field || !fieldDefs) {
    return undefined;
  }

  // field name should match, aggregation should not disagree
  for (const item of fieldDefs) {
    if (item.field === fieldOption.field) {
      if (item.aggregate) {
        if (item.aggregate === fieldOption.aggregate || !fieldOption.aggregate) {
          return item;
        }
      } else {
        return item;
      }
    }
  }

  // return undefined if no match was found
  return undefined;
}

/**
 * Supplement a fieldOption (from options.fields[]) with a fieldDef, config
 * (which provides timeFormat, numberFormat, countTitle)
 * Either fieldOption or fieldDef can be undefined, but they cannot both be undefined.
 * config (and its members timeFormat, numberFormat and countTitle) can be undefined.
 * @return the supplemented fieldOption, or undefined on error
 */
export function supplementFieldOption(fieldOption: FieldOption, fieldDef: FieldDef<string>, vlSpec: TopLevelExtendedSpec) {
  // many specs don't have config
  const config = vl.util.extend({}, vlSpec.config);

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
  const supplementedFieldOption: SupplementedFieldOption = {};

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
  if (fieldDef.type === TEMPORAL && fieldDef.timeUnit) {
    // in most cases, if it's a (TIMEUNIT)T, we remove original T
    const originalTemporalField = fieldDef.field;
    supplementedFieldOption.removeOriginalTemporalField = originalTemporalField;

    // handle corner case: if T is present in vlSpec, then we keep both T and (TIMEUNIT)T
    const fieldDefs = vl.spec.fieldDefs(vlSpec);
    for (const items of fieldDefs) {
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
  } else { // when user doesn't provide format, supplement format using timeUnit, timeFormat, and numberFormat
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
