(function () {

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
        vlTooltip.linkToView(result.view, vlSpec, options);
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
        vgTooltip.linkToView(view, options);
      });
    })
  }

  /* Vega-Lite Examples */
  // Scatter Plot
  var scatterOpts = {
    showFields: [
      {
        field: "Name"
      },
      {
        field: "Horsepower",
        type: "number"
      },
      {
        field: "Miles_per_Gallon",
        fieldTitle: "Miles per Gallon",
        type: "number"
      }
    ]
  };
  addVlExample("exampleSpecs/scatter.json", "#vis-scatter", scatterOpts);

  // Trellis Barley
  var trellisBarOpts = {
    showFields: [
      {
        field: "variety",
        fieldTitle: "Variety"
      },
      {
        field: "year",
        fieldTitle: "Year"
      },
      {
        field: "site",
        fieldTitle: "Site"
      },
      {
        field: "mean_yield",
        fieldTitle: "Mean(Yield)",
        type: "number",
        format: ".2f"
      }
    ]
  };
  addVlExample("exampleSpecs/trellis_barley.json", "#vis-trellis-barley", trellisBarOpts);

  // Simple Bar Chart
  addVlExample("exampleSpecs/bar.json", "#vis-bar");

  // Stacked Bar Chart
  var stackedBarOpts = {
    showFields: [
      {
        field: "month_date",
        fieldTitle: "Month",
        type: "date",
        format: "month" // can be either VL timeUnit or d3 time format string specifier
      },
      {
        field: "weather",
        fieldTitle: "Weather"
      },
      {
        field: "count",
        fieldTitle: "Count"
      }
    ]
  };
  addVlExample("exampleSpecs/stacked_bar_weather.json", "#vis-stacked-bar", stackedBarOpts);

  // Layered Bar Chart
  var layeredBarOpts = {
    showFields: [
      {
        field: "age",
        fieldTitle: "Age"
      },
      {
        field: "gender",
        fieldTitle: "Gender"
      },
      {
        field: "sum_people",
        fieldTitle: "Population",
        type: "number",
        format: ","
      }
    ]
  };
  addVlExample("exampleSpecs/bar_layered_transparent.json", "#vis-layered-bar", layeredBarOpts);

  // Line Chart
  var lineOpts = {
    colorTheme: "dark"
  }
  addVlExample("exampleSpecs/line.json", "#vis-line", lineOpts);

  // Colored Line Chart
  var colorLineOpts = {}
  addVlExample("exampleSpecs/line_color.json", "#vis-color-line");

  // Area Chart
  addVlExample("exampleSpecs/area_vertical.json", "#vis-area-vertical");


  /* Vega Examples */
  // Arc
  var arcOpts = {
    showFields: [
      {
        field: "data"
      }
    ]
  }
  addVgExample("exampleSpecs/arc.json", "#vis-arc", arcOpts);

  // Choropleth
  var choroplethOpts = {
    showFields: [
      {
        field: "unemp.id",
        fieldTitle: "County ID"
      },
      {
        field: "unemp.rate",
        fieldTitle: "Unemployment Rate",
        type: "number",
        format: ".1%"
      }
    ]
  }
  addVgExample("exampleSpecs/choropleth.json", "#vis-choropleth", choroplethOpts);

  // Force
  var forceOpts = {
    showFields: [
      {
        field: "name",
        fieldTitle: "Name",
        type: "string"
      }
    ]
  }
  addVgExample("exampleSpecs/force.json", "#vis-force", forceOpts);

  // Heatmap
  var heatmapOpts = {
    showFields: [
      {
        field: "date",
        fieldTitle: "Date",
        type: "date",
        format: "yearmonthdate"
      },
      {
        field: "temp",
        fieldTitle: "Temperature(F)"
      },
      {
        field: "hour",
        fieldTitle: "Hour"
      }
    ],
    offset: {
      x: 10,
      y: 0
    }
  }
  addVgExample("exampleSpecs/heatmap.json", "#vis-heatmap", heatmapOpts);

}());
