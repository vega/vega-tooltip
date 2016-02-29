function fillTooltip(event, item) {
  if (!item || !item.datum) return;
  
  // avoid showing tooltip for facet's background
  if (item.datum._facetID) return;
  
  // avoid showing tooltip for axis title and labels
  if (!item.datum._id) return;

  // (zening) TODO: show partial data in tooltip
  let vgData = d3.map(item.datum);
  // remove vega internals
  vgData.remove("_id");
  vgData.remove("_prev");
  let tooltipData = vgData.entries();

  let tooltipRows = d3.select(".vis-tooltip").selectAll(".tooltip-row").data(tooltipData);

  tooltipRows.exit().remove();

  let row = tooltipRows.enter().append("tr")
  .attr("class", "tooltip-row");
  row.append("td").attr("class", "key").text(function(d) { return d.key; });
  row.append("td").attr("class", "value").text(function(d) { return d.value.toString(); });

  updateTooltipPosition(event);
  d3.select(".vis-tooltip").style("opacity", 1);
}

function updateTooltip(event, item) {
  updateTooltipPosition(event);
}

function updateTooltipPosition (event) {
  // by default: put tooltip 10px below cursor
  // if tooltip is close to the bottom of the window, put tooltip 10px above cursor
  d3.select(".vis-tooltip").style("top", function() {
    let tooltipHeight = parseInt(d3.select(this).style("height"));
    if (event.clientY + tooltipHeight + 10 < window.innerHeight) {
      return "" + (event.clientY + 10) + "px";
    } else {
      return "" + (event.clientY - tooltipHeight - 10) + "px";
    }
  })
  // by default: put tooltip 10px to the right of cursor
  // if tooltip is close to the right edge of the window, put tooltip 10 px to the left of cursor
  .style("left", function() {
    let tooltipWidth = parseInt(d3.select(this).style("width"));
    if (event.clientX + tooltipWidth + 10 < window.innerWidth) {
      return "" + (event.clientX + 10) + "px";
    } else {
      return "" + (event.clientX - tooltipWidth - 10) + "px";
    }
  });
}

function clearTooltip() {
  let tooltipRows = d3.select(".vis-tooltip").selectAll(".tooltip-row").data([]);
  tooltipRows.exit().remove();
  d3.select(".vis-tooltip").style("opacity", 0);
}
