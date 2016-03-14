/**
 * Export Vega Tooltip API: vgTooltip.linkToView(vgView, options)
 * options can specify data fields to show in the tooltip and can
 * provide data formats for those fields
 */
var vgTooltip = (function() {
  return {
    linkToView: function(vgView, options) {
      // initialize tooltip with data
      vgView.on("mouseover", function(event, item) {
        tooltipUtil.init(event, item, options);
      });

      // update tooltip position on mouse move
      // (important for large marks e.g. bars)
      vgView.on("mousemove", function(event, item) {
        tooltipUtil.update(event, item, options);
      });

      // clear tooltip
      vgView.on("mouseout", tooltipUtil.clear);
    }
  }
}());

/**
 * Export Vega-Lite Tooltip API: vlTooltip.linkToView(vgView, vlSpec, options)
 * options can specify data fields to show in the tooltip and can
 * overwrite data formats in vlSpec
 */
var vlTooltip = (function() {

  // supplement options with timeUnit and numberFormat from vlSpec
  function supplementOptions (options, vlSpec) {
    if (!options) {
      options = {};
    }

    // supplement numberFormat
    if (vlSpec.config && vlSpec.config.numberFormat) {
      options.numberFormat = vlSpec.config.numberFormat;
    }

    // supplement timeUnit
    vl.spec.fieldDefs(vlSpec).forEach(function(channel) {
      if (channel.timeUnit) {
        if (!options.fieldsWithTimeUnit) {
          options.fieldsWithTimeUnit = [];
        }
        try {
          // TODO(zening): rename field because VL renames field
          // e.g. date --> month_date, date --> year_date
          var renamedField = channel.timeUnit + '_' + channel.field;
          options.fieldsWithTimeUnit.push({field: renamedField, timeUnit: channel.timeUnit});
        }
        catch (error) {
          console.error('[VgTooltip] Error parsing Vega-Lite timeUnit: ' + error);
        }
      }
    });

    return options;
  }

  return {
    linkToView: function(vgView, vlSpec, options) {

      options = supplementOptions(options, vlSpec);

      // initialize tooltip with data
      vgView.on("mouseover", function(event, item) {
        tooltipUtil.init(event, item, options);
      });

      // update tooltip position on mouse move
      // (important for large marks e.g. bars)
      vgView.on("mousemove", function(event, item) {
        tooltipUtil.update(event, item, options);
      });

      // clear tooltip
      vgView.on("mouseout", tooltipUtil.clear);
    }
  }
}());

/**
 * Export common utilities: init, update and clear
 * init(): initialize tooltip with data
 * update(): update tooltip as mouse moves
 * clear(): clear tooltip data
 */
var tooltipUtil = (function() {

  // decide if a chart element deserves tooltip
  function shouldShowTooltip (item) {
    if (!item || !item.datum) return false;

    // avoid showing tooltip for facet's background
    if (item.datum._facetID) return false;

    // avoid showing tooltip for axis title and labels
    if (!item.datum._id) return false;

    return true;
  }

  // returns true tooltip should show default fields bound to an item (item.datum)
  // returns false if tooltip should only show a custom subset of fields specified by options
  function shouldShowDefaultFields (options) {
    if (options && options.showFields && options.showFields.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  // update tooltip position
  function updatePosition (event, options) {
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

  // update tooltip color theme according to options.colorTheme
  function updateTheme (options) {
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

  // reset color themes to default
  function clearTheme () {
    d3.select("#vis-tooltip").classed('dark-theme light-theme', false);
  }

  function getTooltipData (item, options) {

    // get field value from an item's datum,
    // even if the field is buried down in the object hierarchy
    function getFieldValue (datum, field) {
      if(field.includes('.')) {
        var accessors = field.split('.');
        var value = datum;
        var path = '';
        accessors.forEach(function (a) {
          if (value[a]) {
            value = value[a];
            path = path + '.' + a;
          }
          else {
            console.warn('[VgTooltip] Cannot find field ' + path + ' in data.');
            return;
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
          return;
        }
      }
    }

    function getFieldTitle (opt) {
      if (opt.fieldTitle) {
        return opt.fieldTitle;
      }
      else {
        return opt.field;
      }
    }

    // custom tooltip: fields & format
    function getCustomFieldsData (item, options) {
      var content = [];

      options.showFields.forEach(function(opt) {

        var title = getFieldTitle(opt);

        var value = getFieldValue(item.datum, opt.field);

        var formattedValue;
        if (!opt.type || !opt.format) {
          formattedValue = autoFormat(opt.field, value, options);
        }
        else {
          switch (opt.type) {
            case 'date':
              if (vl.timeUnit.TIMEUNITS.indexOf(opt.format) > -1) {
                var specifier = vl.timeUnit.format(opt.format)
                var formatter = dl.format.time(specifier);
                formattedValue = formatter(value);
              }
              else {
                var formatter = dl.format.time(opt.format);
                formattedValue = formatter(value);
              }

              break;
            case 'number':
              var formatter = dl.format.number(opt.format);
              formattedValue = formatter(value);
              break;
            case 'string':
            default:
              formattedValue = value;
          }
        }

        content.push({fieldTitle: title, fieldValue: formattedValue});
      });

      return content;
    }

    // automatically format date, number and string values
    function autoFormat(field, value, options) {

      // check if timeUnit applies to the field
      if (options.fieldsWithTimeUnit) {
        var timeFields = d3.map(options.fieldsWithTimeUnit, function(d) { return d.field; });
        if (timeFields.has(field)) {
          var specifier = vl.timeUnit.format(timeFields.get(field).timeUnit);
          var formatter = dl.format.time(specifier);
          return formatter(value);
        }
      }

      // format other date, number, string values
      switch (dl.type(value)) {
        case 'date':
          var formatter = dl.format.auto.time();
          return formatter(value);
        case 'number':
          if (options.numberFormat) {
            var formatter = dl.format.number(options.numberFormat);
            return formatter(value);
          }
        case 'boolean':
        case 'string':
        default:
          return value;
      }
    }

    // auto-prepare tooltip: top level fields, default format
    // drop number and date data for line charts and area charts #1
    function getDefaultFieldsData (item, options) {
      var content = [];

      var itemData = d3.map(item.datum);
      itemData.remove("_id");
      itemData.remove("_prev");

      if (item.mark.marktype === "line" || item.mark.marktype === "area") {
        console.warn('[VgTooltip]: By default, we only show qualitative data in tooltip.');

        itemData.forEach(function(field, value) {
          switch(dl.type(value)) {
            case 'boolean':
            case 'string':
              content.push({fieldTitle: field, fieldValue: value});
              break;
            case 'number':
            case 'date':
            default:
              break;
          }
        })
      }
      else {
        itemData.forEach(function(field, value) {
          var formattedValue = autoFormat(field, value, options);
          content.push({fieldTitle: field, fieldValue: formattedValue});
        });
      }

      return content;
    }

    var tooltipData;

    if ( shouldShowDefaultFields(options) === true ) {
      tooltipData = getDefaultFieldsData(item, options);
    }
    else {
      tooltipData = getCustomFieldsData(item, options);
    }

    return tooltipData;
  }

  return {
    init: function (event, item, options) {
      if(shouldShowTooltip(item) === false) return;

      var tooltipData = getTooltipData(item, options);

      // if there is no "meaningful" data, don't show tooltip
      // "meaningful": as decided by item and options
      if (!tooltipData || tooltipData.length === 0) return;

      var tooltipRows = d3.select("#vis-tooltip").selectAll(".tooltip-row").data(tooltipData);

      tooltipRows.exit().remove();

      var row = tooltipRows.enter().append("tr")
      .attr("class", "tooltip-row");
      row.append("td").attr("class", "key").text(function(d) { return d.fieldTitle + ":"; });
      row.append("td").attr("class", "value").text(function(d) { return d.fieldValue; });

      updatePosition(event, options);
      updateTheme(options);
      d3.select("#vis-tooltip").style("opacity", 1);
    },
    update: function(event, item, options) {
      updatePosition(event, options);
    },
    clear: function() {
      var tooltipRows = d3.select("#vis-tooltip").selectAll(".tooltip-row").data([]);
      tooltipRows.exit().remove();
      clearTheme();
      d3.select("#vis-tooltip").style("opacity", 0);
    }
  }
}());
