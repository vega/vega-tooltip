"use strict";

(function() {
  /**
  * Export Vega Tooltip API: vg.tooltip(vgView, options)
  * options can specify whether to show all fields or to show only custom fields
  * It can also provide custom title and format for fields
  */
  window.vg = window.vg || {};
  window.vg.tooltip = function(vgView, options) {
    if (!options) {
      options = {};
    }

    // initialize tooltip with item data and options on mouse over
    vgView.on("mouseover", function(event, item) {
      init(event, item, options);
    });

    // update tooltip position on mouse move
    // (important for large marks e.g. bars)
    vgView.on("mousemove", function(event, item) {
      update(event, item, options);
    });

    // clear tooltip on mouse out
    vgView.on("mouseout", function(event, item) {
      clear();
    });
  };

  /**
  * Export Vega-Lite Tooltip API: vl.tooltip(vgView, vlSpec, options)
  * options can specify whether to show all fields or to show only custom fields
  * It can also provide custom title and format for fields
  * options can be supplemented by vlSpec
  */
  window.vl = window.vl || {};
  window.vl.tooltip = function(vgView, vlSpec, options) {
    if (!options) {
      options = {};
    }

    options = supplementOptions(options, vlSpec);

    // initialize tooltip with item data and options on mouse over
    vgView.on("mouseover", function(event, item) {
      init(event, item, options);
    });

    // update tooltip position on mouse move
    // (important for large marks e.g. bars)
    vgView.on("mousemove", function(event, item) {
      update(event, item, options);
    });

    // clear tooltip on mouse out
    vgView.on("mouseout", function(event, item) {
      clear();
    });
  };

  /* Mapping from fieldDef.type to formatType */
  var formatTypeMap = {
    "quantitative": "number",
    "temporal": "time",
    "ordinal": undefined,
    "nominal": undefined
  }

  /**
  * (Vega-Lite only) Supplement options with vlSpec
  * if options.showAllFields is true or undefined, vlSpec will supplement
  * options.fields with all fields in the spec
  * if options.showAllFields is false, vlSpec will only supplement existing fields
  * in options.fields
  */
  function supplementOptions(options, vlSpec) {
    // fields to be supplemented by vlSpec
    var supplementedFields = [];

    var timeFormat = vlSpec.config ? vlSpec.config.timeFormat : undefined;
    var numberFormat = vlSpec.config ? vlSpec.config.numberFormat : undefined;

    // if showAllFields is true or undefined, supplement all fields in vlSpec
    if (options.showAllFields !== false) {
      vl.spec.fieldDefs(vlSpec).forEach(function(fieldDef){
        // get a field in options that matches the fieldDef
        var field = getField(options.fields, fieldDef);

        // supplement the field with fieldDef, timeFormat and numberFormat
        var supplementedField = supplementField(field, fieldDef, timeFormat, numberFormat);

        supplementedFields.push(supplementedField);
      });
    }
    // if showAllFields is false, only supplement existing fields in options.fields
    else {
      if (options.fields && options.fields.length > 0) {
        options.fields.forEach(function(field) {
          // get the fieldDef in vlSpec that matches the field
          var fieldDef = getFieldDef(vl.spec.fieldDefs(vlSpec), field);

          // supplement the field with fieldDef, timeFormat and numberFormat
          var supplementedField = supplementField(field, fieldDef, timeFormat, numberFormat);

          supplementedFields.push(supplementedField);
        })
      }
    }

    // TODO(zening): supplement binned fields

    options.fields = supplementedFields;

    return options;
  }

  /**
  * Find a field in fields that matches a fieldDef
  * If the fieldDef is aggregated, find a field that matches the field name and
  * the aggregation of fieldDef.
  * If the fieldDef is not aggregated, find a field that matches the field name.
  * @return the matching field, or undefined if no match was found
  */
  function getField(fields, fieldDef) {
    if (!fieldDef || !fields || fields.length <= 0) return;

    var matchedField = undefined;

    // if aggregate, match field name and aggregate operation
    if (fieldDef.aggregate) {
      // try find the perfect match: field name equals, aggregate operation equals
      fields.forEach(function(field) {
        if (!matchedField && field.field === fieldDef.field && field.aggregate === fieldDef.aggregate) {
          matchedField = field;
        }
      });

      // try find the second-best match: field name equals, field.aggregate = undefined
      if (!matchedField) {
        fields.forEach(function(field) {
          if (!matchedField && field.field === fieldDef.field && field.aggregate === undefined) {
            matchedField = field;
          }
        });
      }
    }
    // if not aggregate, just match field name
    else {
      fields.forEach(function(field) {
        if (!matchedField && field.field === fieldDef.field) {
          matchedField = field;
        }
      });
    }

    return matchedField;
  }

  /**
  * Find a fieldDef that matches field
  * A matching fieldDef should have the same field name as field.
  * If the matching fieldDef is aggregated, the aggregation should not contradict
  * with that of the field.
  * @return the matching fieldDef, or undefined if no match was found
  */
  function getFieldDef(fieldDefs, field) {
    if (!field || !field.field || !fieldDefs) return;

    var matchedFieldDef = undefined;

    // field name should match, aggregation should not disagree
    fieldDefs.forEach(function(fieldDef) {
      if (!matchedFieldDef && fieldDef.field === field.field) {
        if (fieldDef.aggregate) {
          if (fieldDef.aggregate === field.aggregate || field.aggregate === undefined) {
            matchedFieldDef = fieldDef;
          }
        }
        else {
          matchedFieldDef = fieldDef;
        }
      }
    });

    return matchedFieldDef;
  }

  /**
  * Supplement a field (from options) with a fieldDef, timeFormat and numberFormat
  * Either field or fieldDef can be undefined, but they cannot both be undefined.
  * timeFormat and numberFormat can be undefined.
  * @return the supplemented field, or undefined on error
  */
  function supplementField(field, fieldDef, timeFormat, numberFormat) {
    // at least one of field and fieldDef should exist
    if (!field && !fieldDef) {
      console.error("[Tooltip] Cannot supplement a field when field and fieldDef are both empty.");
      return;
    }
    if (!field && fieldDef) field = {};
    if (field && !fieldDef) fieldDef = {};

    // the supplemented field config
    var supplementedField = {};

    // supplement field name with underscore prefixes (e.g. "mean_", "yearmonth_")
    supplementedField.field = fieldDef.field ?
      vl.fieldDef.field(fieldDef) : field.field;

    // supplement title
    supplementedField.title = field.title ?
      field.title : vl.fieldDef.title(fieldDef);

    // supplement formatType
    supplementedField.formatType = field.formatType ?
      field.formatType : formatTypeMap[fieldDef.type];

    // supplement format
    if (field.format) {
      supplementedField.format = field.format;
    }
    // when user doesn't provide format, supplement format using timeUnit, timeFormat, and numberFormat
    else {
      switch (supplementedField.formatType) {
        case "time":
          supplementedField.format = fieldDef.timeUnit ?
            vl.timeUnit.format(fieldDef.timeUnit) : timeFormat;
          break;
        case "number":
          supplementedField.format = numberFormat;
          break;
        case "string":
        default:
      }
    }

  return supplementedField;
  }


  /* Initialize tooltip with data */
  function init(event, item, options) {
    if( shouldShowTooltip(item) === false ) return;

    // get tooltip placeholder
    var tooltipPlaceholder = getTooltipPlaceholder();

    // prepare data for tooltip
    var tooltipData = getTooltipData(item, options);
    if (!tooltipData || tooltipData.length === 0) return;

    // bind data to tooltip
    bindData(tooltipPlaceholder, tooltipData);

    updatePosition(event, options);
    updateColorTheme(options);
    d3.select("#vis-tooltip").style("display", "block");
  }

  /* Update tooltip position on mousemove */
  function update(event, item, options) {
    updatePosition(event, options);
  }

  /* Clear tooltip */
  function clear() {
    clearData();
    clearColorTheme();
    d3.select("#vis-tooltip").style("display", "none");
  }


  /* Decide if a chart element deserves tooltip */
  function shouldShowTooltip (item) {
    if (!item || !item.datum) return false;

    // avoid showing tooltip for facet's background
    if (item.datum._facetID) return false;

    // avoid showing tooltip for axis title and labels
    if (!item.datum._id) return false;

    return true;
  }

  /**
  * Prepare data to be bound to the tooltip element
  * @return [{ title: ..., value: ...}]
  */
  function getTooltipData(item, options) {

    var tooltipData; // this array will be bind to the tooltip element
    if ( options.showAllFields === true || options.showAllFields === undefined ) {
      tooltipData = getAllFields(item, options);
    }
    else {
      tooltipData = getCustomFields(item, options);
    }

    return tooltipData;
  }


  /**
  * Prepare custom fields (specified by options) for tooltip.
  * @return An array of formatted fields
  * [{ title: ..., value: ...}]
  */
  function getCustomFields(item, options) {

    var tooltipData = [];

    options.fields.forEach(function(field) {
      // TODO(zening): binned fields

      // get field title
      var title = field.title ? field.title : field.field;

      // get field value
      var value = getValue(item.datum, field.field);
      if (value === undefined) return;

      // format value
      var formattedValue = customFormat(value, field.formatType, field.format) || autoFormat(value);

      // add formatted data to tooltipData
      tooltipData.push({title: title, value: formattedValue});

    });

    return tooltipData;
  }

  /**
  * Get one field value from a datum.
  * @param {string} field - the name of the field. It can contain "." to specify
  * that the field is not a direct child of datum
  * @return the field value if successful,
  * undefined if the field cannot be found in item.datum
  */
  // TODO(zening): Mute "Cannot find field" warnings for composite vis (issue #39)
  function getValue(datum, field) {
    if (field.includes(".")) {
      var accessors = field.split(".");
      var value = datum;
      var path = "";
      accessors.forEach(function(a) {
        if (value[a]) {
          value = value[a];
          path = path + "." + a;
        }
        else {
          console.warn("[Tooltip] Cannot find field " + path + " in data.");
          return undefined;
        }
      });
      return value;
    }
    else {
      if (datum[field]) {
        return datum[field];
      }
      else {
        console.warn("[Tooltip] Cannot find field " + field + " in data.");
        return undefined;
      }
    }
  }


  /**
  * Prepare all fields (item.datum's direct children) for tooltip.
  * @return An array of formatted fields
  * [{ title: ..., value: ...}]
  */
  function getAllFields(item, options) {
    var tooltipData = [];

    var fieldConfigs = d3.map(options.fields, function(d) { return d.field; });

    var itemData = d3.map(item.datum);

    var removeKeys = [
      "_id", "_prev",
      "count_start", "count_end",
      "layout_start", "layout_mid", "layout_end", "layout_path", "layout_x", "layout_y"
    ];
    removeFields(itemData, removeKeys);

    // TODO(zening): if there are binned fields, remove _start, _end, _mid, _range fields, add bin_field and its value

    dropFieldsForLineArea(item.mark.marktype, itemData);

    itemData.forEach(function(field, value) {
      // get title
      var title;
      if(fieldConfigs.has(field) && fieldConfigs.get(field).title) {
        title = fieldConfigs.get(field).title;
      }
      else {
        title = field;
      }

      // format value
      if (fieldConfigs.has(field)) {
        var formatType = fieldConfigs.get(field).formatType;
        var format = fieldConfigs.get(field).format;
      }
      var formattedValue = customFormat(value, formatType, format) || autoFormat(value);

      tooltipData.push({title: title, value: formattedValue});
    });

    return tooltipData;
  }

  /**
  * Remove multiple fields from a tooltip data map, using removeKeys
  *
  * Certain meta data fields (e.g. "_id", "_prev") should be hidden in the tooltip
  * by default. This function can be used to remove these fields from tooltip data.
  * @param {d3.map} dataMap - the data map that contains tooltip data
  * @param {string[]} removeKeys - the fields that should be removed from dataMap
  */
  function removeFields(dataMap, removeKeys) {
    removeKeys.forEach(function(key) {
      dataMap.remove(key);
    })
  }

  /**
  * Drop fields for line charts and area charts.
  *
  * Lines and areas are defined by a series of datum. Without layering, tooltip
  * will only show one datum per line / area mark. As a partial fix, we drop
  * quantitative fields for line charts and area charts. This is the current
  * implementation of the function.
  *
  * This doesn't completely solve the problem: if a data set contains a field
  * that is not used for encoding, it will still show up in the tooltip and
  * confuse users. The additional qualitative field's value may vary for a line
  * or area mark but tooltip will only be able to show one value. As a better
  * partial fix, we may drop fields in the x and y channels and only show fields
  * in the other channels (typically color). In this way, if a qualitative field
  * is not used for encoding, it will not show up in the tooltip.
  *
  * Eventually, we will use vega-lite layering to properly show all fields.
  */
  // TODO(zening): use vega-lite layering to support tooltip on line charts and area charts (issue #1)
  // TODO(zening): change the logic from drop quant fields to only show non-x-y fields in fieldDefs
  function dropFieldsForLineArea(marktype, itemData) {
    if (marktype === "line" || marktype === "area") {
      console.warn("[Tooltip]: By default, we only show qualitative data for " + marktype + " charts.");

      var quanKeys = [];
      itemData.forEach(function(field, value) {
        switch (dl.type(value)) {
          case "number":
          case "date":
            quanKeys.push(field);
            break;
          case "boolean":
          case "string":
        }
      });
      removeFields(itemData, quanKeys);
    }
  }

  /**
  * Use formatType and format to format time, number or string value
  * @return the formatted time, number or string value, or undefined if value or
  * formatType is missing
  */
  function customFormat(value, formatType, format) {
    if (!value || !formatType) return;

    switch (formatType) {
      case "time":
        return format ? dl.format.time(format)(value) : dl.format.auto.time()(value);
      case "number":
        return format ? dl.format.number(format)(value) : dl.format.auto.number()(value);
      case "string":
      default:
        return value;
    }
  }

  /**
  * Automatically format a time, number or string value
  * @return the formated time, number or string value
  */
  function autoFormat(value) {
    switch (dl.type(value)) {
      case "date":
        return dl.format.auto.time()(value);
      case "number":
        return dl.format.auto.number()(value);
      case "boolean":
      case "string":
      default:
        return value;
    }
  }


  /**
  * Get the HTML placeholder by id "#vis-tooltip"
  * If none exists, create an element
  * @returns the HTML placeholder for tooltip
  */
  function getTooltipPlaceholder() {
    var tooltipPlaceholder;
    if (d3.select("#vis-tooltip").empty()) {
      tooltipPlaceholder = d3.select("body").append("div")
        .attr("id", "vis-tooltip");
    }
    else {
      tooltipPlaceholder = d3.select("#vis-tooltip");
    }
    return tooltipPlaceholder;
  }

  /**
  * Bind tooltipData to the tooltip placeholder
  */
  function bindData(tooltipPlaceholder, tooltipData) {
    var tooltipRows = tooltipPlaceholder.append("table").selectAll(".tooltip-row")
      .data(tooltipData);

    tooltipRows.exit().remove();

    var row = tooltipRows.enter().append("tr")
      .attr("class", "tooltip-row");
    row.append("td").attr("class", "key").text(function(d) { return d.title + ":"; });
    row.append("td").attr("class", "value").text(function(d) { return d.value; });
  }

  /**
  * Clear tooltip data
  */
  function clearData() {
    var tooltipRows = d3.select("#vis-tooltip").selectAll(".tooltip-row").data([]);
    tooltipRows.exit().remove();
  }

  /**
  * Update tooltip position
  * Default position is 10px right of and 10px below the cursor. This can be
  * overwritten by options.
  */
  function updatePosition(event, options) {
    // determine x and y offsets, defaults are 10px
    var offsetX = 10;
    var offsetY = 10;
    if (options && options.offset && !(options.offset.x === undefined)) {
      offsetX = options.offset.x;
    }
    if (options && options.offset && !(options.offset.y === undefined)) {
      offsetY = options.offset.y;
    }

    d3.select("#vis-tooltip")
      .style("top", function() {
        // by default: put tooltip 10px below cursor
        // if tooltip is close to the bottom of the window, put tooltip 10px above cursor
        var tooltipHeight = parseInt(d3.select(this).style("height"));
        if (event.clientY + tooltipHeight + offsetY < window.innerHeight) {
          return "" + (event.clientY + offsetY) + "px";
        } else {
          return "" + (event.clientY - tooltipHeight - offsetY) + "px";
        }
      })
      .style("left", function() {
        // by default: put tooltip 10px to the right of cursor
        // if tooltip is close to the right edge of the window, put tooltip 10 px to the left of cursor
        var tooltipWidth = parseInt(d3.select(this).style("width"));
        if (event.clientX + tooltipWidth + offsetX < window.innerWidth) {
          return "" + (event.clientX + offsetX) + "px";
        } else {
          return "" + (event.clientX - tooltipWidth - offsetX) + "px";
        }
      });
  }

  /**
  * Update tooltip color theme according to options.colorTheme
  *
  * If colorTheme === "dark", apply dark theme to tooltip.
  * Otherwise apply light color theme.
  */
  function updateColorTheme(options) {
    clearColorTheme();
    if (options && options.colorTheme === "dark") {
      d3.select("#vis-tooltip").classed("dark-theme", true);
    }
    else {
      d3.select("#vis-tooltip").classed("light-theme", true);
    }
  }

  /* Clear color themes */
  function clearColorTheme() {
    d3.select("#vis-tooltip").classed("dark-theme light-theme", false);
  }


}());
