(function() {

  function addVlExample(path, id, options) {
    d3.json(path, function(error, vlSpec) {
      if (error) {
        return console.warn(error);
      }
      var stackedbarEmbed = {
        mode: "vega-lite",
        spec: vlSpec
      };
      vg.embed(id, stackedbarEmbed, function(error, result) {
        vl.tooltip(result.view, vlSpec, options);
      });
    });
  }

  function addVgExample(path, id, options) {
    d3.json(path, function(error, vgSpec) {
      if (error) {
        return console.warn(error);
      }
      vg.parse.spec(vgSpec, function(error, chart) {
        var view = chart({el:id}).update();
        vg.tooltip(view, options);
      });
    })
  }

  /* Vega-Lite Examples */
  // Scatter Plot
  var scatterOpts = {
    showAllFields: false,
    fields: [
      {field: "Name"},
      {field: "Horsepower"},
      {
        field: "Miles_per_Gallon",
        title: "Miles per Gallon"
      }
    ]
  };
  addVlExample("exampleSpecs/scatter.json", "#vis-scatter", scatterOpts);

  // Bubble Plot with Multiple Aggregations on the same field
  var bubbleOpts = {
    showAllFields: true,
    fields: [
      {
        field: "Horsepower",
        aggregate: "mean",
        formatType: "number",
        format: ".2f"
      },
      {
        field: "Horsepower",
        aggregate: "stdevp",
        formatType: "number",
        format: ".2f"
      }
    ]
  }
  addVlExample("exampleSpecs/bubble_multiple_aggregation.json", "#vis-bubble-multiagg", bubbleOpts);

  // Trellis Barley
  var trellisBarOpts = {
    showAllFields: false,
    fields: [
      {
        field: "yield",
        formatType: "number",
        format: ".2f"
      },
      {field: "year"},
      {field: "variety"},
      {field: "site"}
    ]
  };
  addVlExample("exampleSpecs/trellis_barley.json", "#vis-trellis-barley", trellisBarOpts);

  // Scatter Binned
  var binMovieOpts = {
    showAllFields: false,
    fields: [
      {field: "Rotten_Tomatoes_Rating"},
      {field: "IMDB_Rating"},
      {field: "*"}
    ]
  };
  addVlExample("exampleSpecs/scatter_binned.json", "#vis-scatter-binned", binMovieOpts);

  // Simple Bar Chart
  addVlExample("exampleSpecs/bar.json", "#vis-bar");

  // Stacked Bar Chart
  // var stackedBarOpts = {
  //   showAllFields: false,
  //   fields: [
  //     {field: "weather"},
  //     {field: "*"},
  //     {field: "date"}
  //   ]
  // };
  addVlExample("exampleSpecs/stacked_bar_weather.json", "#vis-stacked-bar");

  // Layered Bar Chart
  // var layeredBarOpts = {
  //   showAllFields: false,
  //   fields: [
  //     {field: "gender"},
  //     {field: "age"},
  //     {
  //       field: "people",
  //       title: "population",
  //       formatType: "number"
  //     }
  //   ]
  // };
  addVlExample("exampleSpecs/bar_layered_transparent.json", "#vis-layered-bar");

  // Line Chart
  var lineOpts = {
    colorTheme: "dark"
  }
  addVlExample("exampleSpecs/line.json", "#vis-line", lineOpts);

  // Colored Line Chart
  var colorLineOpts = {}
  addVlExample("exampleSpecs/line_color.json", "#vis-color-line", colorLineOpts);

  // Area Chart
  addVlExample("exampleSpecs/area_vertical.json", "#vis-area-vertical");


  /* Vega Examples */
  // Arc
  // var arcOpts = {
  //   showAllFields: false,
  //   fields: [
  //     {field: "data"}
  //   ]
  // }
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
      {field: "name"}
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
      {field: "hour"}
    ]
  }
  addVgExample("exampleSpecs/heatmap.json", "#vis-heatmap", heatmapOpts);

}());
