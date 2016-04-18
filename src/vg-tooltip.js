"use strict";

(function() {
  /**
  * Export Vega Tooltip API: vgTooltip(vgView, options)
  * options can specify data fields to show in the tooltip and can
  * provide data formats for those fields
  */
  window.vg.tooltip = function(vgView, options) {
    if (!options) {
      options = {};
    }

    // initialize tooltip with data
    vgView.on("mouseover", function(event, item) {
      init(event, item, options);
    });

    // update tooltip position on mouse move
    // (important for large marks e.g. bars)
    vgView.on("mousemove", function(event, item) {
      update(event, item, options);
    });

    // clear tooltip
    vgView.on("mouseout", function(event, item) {
      clear();
    });
  };

  /**
  * Export Vega-Lite Tooltip API: vlTooltip(vgView, vlSpec, options)
  * options can specify data fields to show in the tooltip and can
  * overwrite data formats in vlSpec
  */
  window.vl.tooltip = function(vgView, vlSpec, options) {
    if (!options) {
      options = {};
    }

    options = supplementOptions(options, vlSpec);

    // initialize tooltip with data
    vgView.on("mouseover", function(event, item) {
      init(event, item, options);
    });

    // update tooltip position on mouse move
    // (important for large marks e.g. bars)
    vgView.on("mousemove", function(event, item) {
      update(event, item, options);
    });

    // clear tooltip
    vgView.on("mouseout", function(event, item) {
      clear();
    });
  };

  /* Mapping from fieldDef.type to options.formatType */
  var formatTypeMap = {
    'quantitative': 'number',
    'ordinal': undefined,
    'temporal': 'time',
    'nominal': 'string'
  }

  /**
  * Supplement options with vlSpec
  * if options.showAllFields is true or undefined, vlSpec will supplement options.fields
  * with all fields in the spec
  * if options.showAllFields is false, vlSpec will only supplement existing fields
  * in options.fields
  */
  function supplementOptions(options, vlSpec) {
    // vlSpec supplemented field configs
    var supplementedConfigs = [];

    var timeFormat = vlSpec.config ? vlSpec.config.timeFormat : undefined;
    var numberFormat = vlSpec.config ? vlSpec.config.numberFormat : undefined;

    // if showAllFields, supplement all fields
    if (options.showAllFields === true || options.showAllFields === undefined) {
      vl.spec.fieldDefs(vlSpec).forEach(function(fieldDef){
        var field = fieldDef.field;

        // user-specified field config
        var userFieldConfig = getUserFieldConfig(fieldDef, options.fields);

        // supplemented the field config
        var suppFieldConfig = supplementField(userFieldConfig, fieldDef, timeFormat, numberFormat);

        supplementedConfigs.push(suppFieldConfig);
      });
    }
    // if showAllFields is false, only supplement existing fields
    else {
      if (options.fields && options.fields.length > 0) {
        options.fields.forEach(function(userFieldConfig) {
          // find the right fieldDef
          var fieldDef = getFieldDef(userFieldConfig, vl.spec.fieldDefs(vlSpec));

          // supplement the field config
          var suppFieldConfig = supplementField(userFieldConfig, fieldDef, timeFormat, numberFormat);

          supplementedConfigs.push(suppFieldConfig);
        })
      }
    }

    // TODO(zening): supplement binned fields

    options.fields = supplementedConfigs;

    return options;
  }

  /**
  * Given a fieldDef from vlSpec, find the corresponding user-specified field config.
  * If we know from fieldDef that the field is aggregated, we find a user-specified
  * field config that matches the field name and the aggregation.
  * If the field is not aggregated, we just find a user-specified field config
  * that matches the field name.
  * @return a user-specified field config if there is a successful match, undefined otherwise
  */
  function getUserFieldConfig(fieldDef, optFields) {
    if (!fieldDef || !optFields || optFields.length <= 0) return;

    var userFieldConfig = undefined;

    // if aggregate, match field name and aggregate operation
    if (fieldDef.aggregate) {
      // try find the perfect match: field name equals, aggregate operation equals
      optFields.forEach(function(optFld) {
        if (!userFieldConfig && optFld.field === fieldDef.field && optFld.aggregate === fieldDef.aggregate) {
          userFieldConfig = optFld;
        }
      });

      // try find the second-best match: field name equals, optFld.aggregate = undefined
      if (!userFieldConfig) {
        optFields.forEach(function(optFld) {
          if (!userFieldConfig && optFld.field === fieldDef.field && optFld.aggregate === undefined) {
            userFieldConfig = optFld;
          }
        });
      }

    }
    // if not aggregate, just match field name
    else {
      optFields.forEach(function(optFld) {
        if (!userFieldConfig && optFld.field === fieldDef.field) {
          userFieldConfig = optFld;
        }
      });
    }

    return userFieldConfig;
  }

  /**
  * Given a user-specified field config, find the corresponding fieldDef from vlSpec.
  *
  */
  function getFieldDef(userFieldConfig, specFieldDefs) {
    if (!userFieldConfig || !userFieldConfig.field || !specFieldDefs) return;

    var fieldDef = undefined;

    // field name and aggregation both should match
    specFieldDefs.forEach(function(channel) {
      if (!fieldDef && channel.field === userFieldConfig.field) {
        if (channel.aggregate) {
          if (channel.aggregate === userFieldConfig.aggregate || userFieldConfig.aggregate === undefined) {
            fieldDef = channel;
          }
        }
        else {
          fieldDef = channel;
        }
      }
    });

    return fieldDef;
  }

  /**
  * Supplements a user-specified field config with vlSpec
  * @return the supplemented field config
  */
  function supplementField(userFieldConfig, fieldDef, timeFormat, numberFormat) {
    // at least one of userFieldConfig and fieldDef should exist
    if (!userFieldConfig && !fieldDef) {
      console.warn('[VgTooltip] Cannot supplement a field when user-specified field config and vlSpec field config are both empty.');
      return;
    }
    if (!userFieldConfig && fieldDef) userFieldConfig = {};
    if (userFieldConfig && !fieldDef) fieldDef = {};

    // the supplemented field config
    var suppFieldConfig = {};

    // supplement field name with underscore prefixes
    suppFieldConfig.field = fieldDef.field ?
    vl.fieldDef.field(fieldDef) : userFieldConfig.field;

    // supplement title
    suppFieldConfig.title = userFieldConfig.title ?
    userFieldConfig.title : vl.fieldDef.title(fieldDef);

    // supplement formatType
    suppFieldConfig.formatType = userFieldConfig.formatType ?
    userFieldConfig.formatType : formatTypeMap[fieldDef.type];

    // supplement format based on formatType, using timeUnit, timeFormat, numberFormat
    if (userFieldConfig.format) {
      suppFieldConfig.format = userFieldConfig.format;
    }
    else {
      switch (suppFieldConfig.formatType) {
        case 'time':
        suppFieldConfig.format = fieldDef.timeUnit ? vl.timeUnit.format(fieldDef.timeUnit) : timeFormat;
        break;
        case 'number':
        suppFieldConfig.format = numberFormat;
        break;
        case 'string':
        default:
      }
    }

  return suppFieldConfig;
  }


  /* Initialize tooltip with data */
  function init(event, item, options) {
    if( shouldShowTooltip(item) === false ) return;

    // prepare data for tooltip
    var tooltipData = getTooltipData(item, options);
    if (!tooltipData || tooltipData.length === 0) return;

    bindData(tooltipData);

    updatePosition(event, options);
    updateTheme(options);
    d3.select("#vis-tooltip").style("opacity", 1);
  }

  /* Update tooltip position on mousemove */
  function update(event, item, options) {
    updatePosition(event, options);
  }

  /* Clear tooltip */
  function clear() {
    clearData();
    clearTheme();
    d3.select("#vis-tooltip").style("opacity", 0);
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
  * When options or vlSpec provides custom format for a field, apply custom format.
  * Otherwise, automatically format the field.
  * options can always overwrite format provided by vlSpec.
  * @return Field title and value array, ready to be formatted:
  * [{ title: ..., value: ...}]
  */
  function getCustomFields(item, options) {

    var tooltipData = [];

    options.fields.forEach(function(fld) {
      // TODO(zening): binned fields

      // TODO(zening): aggregated fields, if a field has multiple aggregations, it should have multiple rows in the tooltip

      // get field title
      var title = fld.title? fld.title : fld.field;

      // get field value
      var value = getValue(item.datum, fld.field);
      if (value === undefined) return;

      // format value
      var formattedValue = custFormat(value, fld.formatType, fld.format) || autoFormat(value);

      // add formatted data to tooltipData
      tooltipData.push({title: title, value: formattedValue});

    });

    return tooltipData;
  }

  /**
  * Get one field value from an item's datum,
  * even if the field is not at top-level of item.datum.
  * @return the field value if successful,
  * undefined if the field cannot be found in item.datum
  */
  function getValue(datum, field) {
    if (field.includes('.')) {
      var accessors = field.split('.');
      var value = datum;
      var path = '';
      accessors.forEach(function(a) {
        if (value[a]) {
          value = value[a];
          path = path + '.' + a;
        }
        else {
          console.warn('[VgTooltip] Cannot find field ' + path + ' in data.');
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
        console.warn('[VgTooltip] Cannot find field ' + field + ' in data.');
        return undefined;
      }
    }
  }


  /**
  * Prepare all fields (top-level fields of item.datum) for tooltip.
  * @return Field title and value array, ready to be formatted:
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

    // drop number and date data for line charts and area charts (#1)
    if (item.mark.marktype === "line" || item.mark.marktype === "area") {
      console.warn('[VgTooltip]: By default, we only show qualitative data in tooltip.');

      var quanKeys = [];
      itemData.forEach(function(field, value) {
        switch (dl.type(value)) {
          case 'number':
          case 'date':
          quanKeys.push(field);
          break;
          case 'boolean':
          case 'string':
          default:
            break;
        }
      });
      removeFields(itemData, quanKeys);
    }


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
      var formattedValue = custFormat(value, formatType, format) || autoFormat(value);

      tooltipData.push({title: title, value: formattedValue});
    });

    return tooltipData;
  }

  /* Removes an array of fields from a data map */
  function removeFields(dataMap, removeKeys) {
    removeKeys.forEach(function(key) {
      dataMap.remove(key);
    })
  }

  function custFormat(value, type, format) {
    if (!type) return;

    var formattedValue;
    switch (type) {
      case 'time':
      var formatter = format? dl.format.time(format) : dl.format.auto.time();
      formattedValue = formatter(value);
      break;
      case 'number':
      var formatter = format? dl.format.number(format) : dl.format.auto.number();
      formattedValue = formatter(value);
      break;
      case 'string':
      default:
      formattedValue = value;
    }
    return formattedValue;
  }

  /**
  * Automatically format a date, number or string value
  * @return the formated date, number or string value
  */
  function autoFormat(value) {
    switch (dl.type(value)) {
      case 'date':
      var formatter = dl.format.auto.time();
      return formatter(value);
      case 'number':
      var formatter = dl.format.auto.number();
      return formatter(value);
      case 'boolean':
      case 'string':
      default:
      return value;
    }
  }


  /**
  * Bind data to the tooltip element
  */
  function bindData(tooltipData) {
    var tooltipRows = d3.select("#vis-tooltip").selectAll(".tooltip-row").data(tooltipData);

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

  /* Update tooltip color theme according to options.colorTheme */
  function updateTheme(options) {
    if (options && options.colorTheme) {
      clearTheme();
      switch (options.colorTheme) {
        case 'dark':
        d3.select("#vis-tooltip").classed('dark-theme', true);
        break;
        case 'light':
        default:
      }
    }
  }

  /* Reset color themes to default */
  function clearTheme() {
    d3.select("#vis-tooltip").classed('dark-theme light-theme', false);
  }


}());
