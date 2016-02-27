let vlSpec = {
"data": {"url": "data/cars.json"},
"mark": "circle",
"encoding": {
  "x": {"field": "Horsepower", "type": "quantitative"},
  "y": {"field": "Miles_per_Gallon", "type": "quantitative"}
}
};

let embedSpec = {
  mode: "vega-lite",  // Instruct Vega-Embed to use the Vega-Lite compiler
  spec: vlSpec
};

function onMouseOver(event, item) {
  if (!item || !item.datum) { return; }
  // avoid showing tooltip for facet's background
  if (item.datum._facetID) return;

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
  row.append("td").attr("class", "value").text(function(d) { return d.value; });

  // by default: put tooltip 10px below cursor
  // if tooltip is close to the bottom of the window, put tooltip 10px above cursor
  d3.select(".vis-tooltip").style("top", function() {
    let tooltipHeight = parseInt(d3.select(this).style("height"));
    if (event.pageY + tooltipHeight + 10 < window.innerHeight) {
      return "" + (event.pageY + 10) + "px";
    } else {
      return "" + (event.pageY - tooltipHeight - 10) + "px";
    }
  })
  // by default: put tooltip 10px to the right of cursor
  // if tooltip is close to the right edge of the window, put tooltip 10 px to the left of cursor
  .style("left", function() {
    let tooltipWidth = parseInt(d3.select(this).style("width"));
    if (event.pageX + tooltipWidth + 10 < window.innerWidth) {
      return "" + (event.pageX + 10) + "px";
    } else {
      return "" + (event.pageX - tooltipWidth - 10) + "px";
    }
  })
  .style("opacity", 1);
}

function onMouseOut() {
  let tooltipRows = d3.select(".vis-tooltip").selectAll(".tooltip-row").data([]);
  tooltipRows.exit().remove();
  d3.select(".vis-tooltip").style("opacity", 0);
}

vg.embed("#vis", embedSpec, function(error, result) {
  result.view.on("mouseover", onMouseOver);
  result.view.on("mouseout", onMouseOut);
});
