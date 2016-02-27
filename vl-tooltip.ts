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

function viewOnMouseOver(event, item) {
  if (!item || !item.datum) { return; }
  // avoid showing tooltip for facet's background
  if (item.datum._facetID) return;

  let tooltipData = d3.map(item.datum).entries();
  let tooltipRows = d3.select(".vis-tooltip").selectAll(".tooltip-row").data(tooltipData);

  tooltipRows.exit().remove();

  let row = tooltipRows.enter().append("tr")
  .attr("class", "tooltip-row");
  row.append("td").attr("class", "key").text(function(d) { return d.key; });
  row.append("td").attr("class", "value").text(function(d) { return d.value; });

  d3.select(".vis-tooltip")
  .style("display", "block")
  .style("top", function() { return "" + event.pageY + "px"; })
  .style("left", function() { return "" + event.pageX + "px"; });
}

function viewOnMouseOut() {
  // hide tooltip
  d3.select(".vis-tooltip").style("display", "none");
  // clear tooltip elements
  let tooltipRows = d3.select(".vis-tooltip").selectAll(".tooltip-row").data([]);
  tooltipRows.exit().remove();
}

vg.embed("#vis", embedSpec, function(error, result) {
  result.view.on("mouseover", viewOnMouseOver);
  result.view.on("mouseout", viewOnMouseOut);
});
