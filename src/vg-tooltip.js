var tooltipUtil = function() {

  // decide if a chart element deserves tooltip
  function shouldShowTooltip (item) {
    if (!item || !item.datum) return false;

    // avoid showing tooltip for facet's background
    if (item.datum._facetID) return false;

    // avoid showing tooltip for axis title and labels
    if (!item.datum._id) return false;

    return true;
  }

  // returns true if options specifies fields to show in tooltip
  // returns false if options doesn't specify which fields to show
  function shouldCustomFields (options) {
    if (options && options.showFields && options.showFields.length > 0) {
      return true;
    }
    else {
      return false;
    }
  }

  // update tooltip position
  function updatePosition (event) {
    d3.select("#vis-tooltip")
    .style("top", function() {
      // by default: put tooltip 10px below cursor
      // if tooltip is close to the bottom of the window, put tooltip 10px above cursor
      var tooltipHeight = parseInt(d3.select(this).style("height"));
      if (event.clientY + tooltipHeight + 10 < window.innerHeight) {
        return "" + (event.clientY + 10) + "px";
      } else {
        return "" + (event.clientY - tooltipHeight - 10) + "px";
      }
    })
    .style("left", function() {
      // by default: put tooltip 10px to the right of cursor
      // if tooltip is close to the right edge of the window, put tooltip 10 px to the left of cursor
      var tooltipWidth = parseInt(d3.select(this).style("width"));
      if (event.clientX + tooltipWidth + 10 < window.innerWidth) {
        return "" + (event.clientX + 10) + "px";
      } else {
        return "" + (event.clientX - tooltipWidth - 10) + "px";
      }
    });
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
    function getCustomData (item, options) {
      var content = [];

      options.showFields.forEach(function(opt) {

        var title = getFieldTitle(opt);

        var value = getFieldValue(item.datum, opt.field);

        var formattedValue;
        if (!opt.type || !opt.format) {
          formattedValue = autoFormat(value);
        }
        else {
          switch (opt.type) {
            case 'date':
              var formatter = dl.format.time(opt.format);
              formattedValue = formatter(value);
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

    // automatically format a value
    // currently we only handle dates
    function autoFormat(value) {
      switch (dl.type(value)) {
        case 'date':
          var formatter = dl.format.auto.time();
          return formatter(value);
        case 'boolean':
        case 'number':
        case 'string':
        default:
          return value;
      }
    }

    // auto-prepare tooltip: top level fields, default format
    function getDefaultData (item) {
      var content = [];

      var itemData = d3.map(item.datum);
      itemData.remove("_id");
      itemData.remove("_prev");

      itemData.forEach(function(field, value) {
        var formattedValue = autoFormat(value);
        content.push({fieldTitle: field, fieldValue: formattedValue});
      });

      return content;
    }

    var tooltipData;

    if ( shouldCustomFields(options) === true ) {
      tooltipData = getCustomData(item, options);
    }
    else {
      tooltipData = getDefaultData(item);
    }

    return tooltipData;
  }

  return {
    fill: function (event, item, options) {
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

      updatePosition(event);
      d3.select("#vis-tooltip").style("opacity", 1);
    },
    update: function(event, item) {
      updatePosition(event);
    },
    clear: function() {
      var tooltipRows = d3.select("#vis-tooltip").selectAll(".tooltip-row").data([]);
      tooltipRows.exit().remove();
      d3.select("#vis-tooltip").style("opacity", 0);
    }
  }
}();

var vgTooltip = function() {
  return {
    linkToView: function(view, options) {
      // fill tooltip with data
      view.on("mouseover", function(event, item) {
        tooltipUtil.fill(event, item, options);
      });

      // update tooltip position on mouse move
      // (important for large marks e.g. bars)
      view.on("mousemove", tooltipUtil.update);

      // clear tooltip
      view.on("mouseout", tooltipUtil.clear);
    }
  }
}();

var vlTooltip = function() {

  // supplement options with timeUnit and numberFormat from vlSpec
  function supplementOptions (options, vlSpec) {
    // var channels = d3.map(vl.spec.fieldDefs(vlSpec), function(d) { return d.field; });
    //
    // // supplement field and type
    // if (options && options.length > 0) {
    //   options.forEach(function(opt) {
    //     if(channels.has(opt.field)) {
    //
    //     }
    //   })
    // }
    // else {
    //   console.log(channels);
    //
    //   options = [];
    //   channels.forEach(function(fld, chl) {
    //     var tp = translateType(chl.type);
    //     options.push({field: fld, type: tp});
    //   })
    // }

    // supplement timeUnit

    // supplement numberFormat

    return options;
  }

  return {
    linkToView: function(view, options, vlSpec) {

      // options = supplementOptions(options, vlSpec);

      // fill tooltip with data
      view.on("mouseover", function(event, item) {
        tooltipUtil.fill(event, item, options);
      });

      // update tooltip position on mouse move
      // (important for large marks e.g. bars)
      view.on("mousemove", tooltipUtil.update);

      // clear tooltip
      view.on("mouseout", tooltipUtil.clear);
    }
  }
}();
