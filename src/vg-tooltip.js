var vgTooltip = function() {
  function fill(event, item) {
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
      return d.value.toString();
    });

    update_position(event);
    d3.select("#vis-tooltip").style("opacity", 1);
  }

  function update(event, item) {
    update_position(event);
  }

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

  function clear() {
    var tooltipRows = d3.select("#vis-tooltip").selectAll(".tooltip-row").data([]);
    tooltipRows.exit().remove();
    d3.select("#vis-tooltip").style("opacity", 0);
  }

  return {
    linkToView: function(view, vgSpec) {
      // fill tooltip with data
      view.on("mouseover", fill);

      // update tooltip position on mouse move
      // (important for large marks e.g. bars)
      view.on("mousemove", update);

      // clear tooltip
      view.on("mouseout", clear);
    }
  }
}();
