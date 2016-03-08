var tooltipUtil = function() {

  function update_position(event) {
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

  return {
    fill: function (event, item) {
      if (!item || !item.datum) return;

      // avoid showing tooltip for facet's background
      if (item.datum._facetID) return;

      // avoid showing tooltip for axis title and labels
      if (!item.datum._id) return;

      var vgData = d3.map(item.datum);

      // remove vega internals
      vgData.remove("_id");
      vgData.remove("_prev");

      // get array of key value pairs for tooltip
      var tooltipData = vgData.entries();

      // TODO(zening): show partial data in tooltip
      var tooltipRows = d3.select("#vis-tooltip").selectAll(".tooltip-row").data(tooltipData);

      tooltipRows.exit().remove();

      var row = tooltipRows.enter().append("tr")
      .attr("class", "tooltip-row");
      row.append("td").attr("class", "key").text(function(d) { return d.key + ":"; });
      row.append("td").attr("class", "value").text(function(d) {
        var timeFormatter = dl.format.auto.time();
        switch(dl.type(d.value)) {
          case "date": return timeFormatter(d.value);
          default: return d.value;
        }
      });

      update_position(event);
      d3.select("#vis-tooltip").style("opacity", 1);
    },
    update: function(event, item) {
      update_position(event);
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
    linkToView: function(view, opt) {
      // fill tooltip with data
      view.on("mouseover", tooltipUtil.fill);

      // update tooltip position on mouse move
      // (important for large marks e.g. bars)
      view.on("mousemove", tooltipUtil.update);

      // clear tooltip
      view.on("mouseout", tooltipUtil.clear);
    }
  }
}();

var vlTooltip = function() {
  return {
    linkToView: function(view, vlSpec, opt) {
      // fill tooltip with data
      view.on("mouseover", tooltipUtil.fill);

      // update tooltip position on mouse move
      // (important for large marks e.g. bars)
      view.on("mousemove", tooltipUtil.update);

      // clear tooltip
      view.on("mouseout", tooltipUtil.clear);
    }
  }
}()
