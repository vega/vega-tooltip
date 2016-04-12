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
    fields: ["Name", "Horsepower", "Miles_per_Gallon"],
    fieldConfigs:
    {
      "Miles_per_Gallon": {
        title: "Miles per Gallon"
      }
    }
  };
  addVlExample("exampleSpecs/scatter.json", "#vis-scatter", scatterOpts);

  // Trellis Barley
  var trellisBarOpts = {
    fields: ["mean_yield", "year", "variety", "site"],
    fieldConfigs:
    {
      "mean_yield": {
        title: "MEAN(yield)",
        formatType: "number",
        format: ".2f"
      }
    }
  };
  addVlExample("exampleSpecs/trellis_barley.json", "#vis-trellis-barley", trellisBarOpts);

  // Simple Bar Chart
  addVlExample("exampleSpecs/bar.json", "#vis-bar");

  // Stacked Bar Chart
  var stackedBarOpts = {
    fields: ["weather", "count", "month_date"]
  };
  addVlExample("exampleSpecs/stacked_bar_weather.json", "#vis-stacked-bar", stackedBarOpts);

  // Layered Bar Chart
  var layeredBarOpts = {
    fields: ["gender", "age", "sum_people"],
    fieldConfigs: {
      "sum_people": {
        title: "population",
        formatType: "number",
        format: ","
      }
    }
  };
  addVlExample("exampleSpecs/bar_layered_transparent.json", "#vis-layered-bar", layeredBarOpts);

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
  var arcOpts = {
    fields: ["data"]
  }
  addVgExample("exampleSpecs/arc.json", "#vis-arc", arcOpts);

  // Choropleth
  var choroplethOpts = {
    fields: ["unemp.id", "unemp.rate"],
    fieldConfigs: {
      "unemp.id": { title: "County ID" },
      "unemp.rate": {
        title: "Unemployment Rate",
        formatType: "number",
        format: ".1%"
      }
    }
  }
  addVgExample("exampleSpecs/choropleth.json", "#vis-choropleth", choroplethOpts);

  // Force
  var forceOpts = {
    fields: ["name"]
  }
  addVgExample("exampleSpecs/force.json", "#vis-force", forceOpts);

  // Heatmap
  var heatmapOpts = {
    fields: ["temp", "date", "hour"],
    fieldConfigs: {
      "temp": { title: "temp(F)" },
      "date": {
        formatType: "date",
        format: "yearmonthdate"
      }
    }
  }
  addVgExample("exampleSpecs/heatmap.json", "#vis-heatmap", heatmapOpts);

}());
