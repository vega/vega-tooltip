"use strict";

(function () {
  function addVgExample(path, id, options) {
    d3.json(path, function (error, vgSpec) {
      if (error) {
        return console.error(error);
      }
      var runtime = vega.parse(vgSpec);
      var view = new vega.View(runtime)
        .initialize(document.querySelector(id))
        .hover()
        .run();
      vegaTooltip.vega(view, options);
    })
  }

  // Vega Examples 
  // Arc
  addVgExample("exampleSpecs/arc.json", "#vis-arc");

  // Choropleth
  var choroplethOpts = {
    showAllFields: false,
    fields: [
      {
        field: "unemp.id",
        title: "County ID",
        formatType: "string"
      },
      {
        field: "unemp.rate",
        title: "Unemployment Rate",
        formatType: "number",
        format: ".1%"
      }
    ]
  }
  addVgExample("exampleSpecs/choropleth.json", "#vis-choropleth", choroplethOpts);

  // Force
  var forceOpts = {
    showAllFields: false,
    fields: [
      { field: "name" }
    ]
  }
  addVgExample("exampleSpecs/force.json", "#vis-force", forceOpts);

  // Heatmap
  var heatmapOpts = {
    showAllFields: false,
    fields: [
      {
        field: "temp",
        title: "temp(F)"
      },
      {
        field: "date",
        formatType: "time",
        format: "%B %e"
      },
      { field: "hour" }
    ]
  }
  addVgExample("exampleSpecs/heatmap.json", "#vis-heatmap", heatmapOpts);
}());
