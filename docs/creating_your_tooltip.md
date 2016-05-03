# Creating Your Tooltip

## Step 1. Add The Library

We recommend installing the tooltip library and its dependencies via `npm`:

```bash
npm install vega-lite-tooltip
```

The tooltip library contains a `js` file and a `css` file:

```
node_modules/vega-lite-tooltip/vl-tooltip.min.js
node_modules/vega-lite-tooltip/vl-tooltip.css
```

Alternatively, if you want to manually include the tooltip library and its dependencies, you can add the following lines to your HTML `<head>`. Vega-Lite Tooltip depends on `d3`, `vega`, `vega-lite`, `vega-embed` and `datalib`.

```html
<!-- Dependencies -->
<script src="https://d3js.org/d3.v3.min.js"></script>
<script src="https://vega.github.io/vega/vega.min.js"></script>
<script src="https://vega.github.io/vega-lite/vega-lite.min.js"></script>
<script src="https://vega.github.io/vega-editor/vendor/vega-embed.min.js"></script>
<script src="https://vega.github.io/datalib/datalib.min.js"></script>

<!-- Vega-Lite Tooltip -->
<script src="https://vega.github.io/vega-lite-tooltip/vl-tooltip.min.js"></script>
<link rel="stylesheet" type="text/css" href="https://vega.github.io/vega-lite-tooltip/vl-tooltip.css">
```

## Step 2. Create A Visualization

In your HTML `<body>`, create a placeholder for your Vega-Lite or Vega visualization. Give the placeholder a unique `id`, which you can refer to in your JavaScript. For example:

```html
<!-- Placeholder for my Scatter Plot -->
<div id="vis-scatter"></div>
```

In your JavaScript file, create a Vega-Lite visualization using [`vg.embed`](https://github.com/vega/vega/wiki/Embed-Vega-Web-Components) or create a Vega visualization using [`vg.parse.spec`](https://github.com/vega/vega/wiki/Runtime). For example:

```js
// create a Vega-Lite visualization using vg.embed
vg.embed("#vis-scatter", embedSpec, function(error, result) {
});
```

or

```js
// create a Vega visualization using vg.parse.spec
vg.parse.spec(vgSpec, function(error, chart) {
    var view = chart({el:"#vis-scatter"}).update();
});
```

## Step 3. Create A Tooltip

In your HTML `<body>`, create a placeholder for the tooltip. Give the placeholder an `id` named `vis-tooltip` so that it can be recognized by our plugin. Assign `class` `vg-tooltip` to the tooltip placeholder so that it can pick up the default CSS style our library provides.

```html
<!-- Placeholder for Tooltip -->
<table id="vis-tooltip" class="vg-tooltip"></table>
```

> Tip: Generally speaking you only need one tooltip placeholder per HTML page (even if you have multiple visualizations in that page) because the mouse only points at one thing at a time.

In the callback function of step 2, create your tooltip using either `vl.tooltip()` or `vg.tooltip()`. `vl.tooltip()` creates a tooltip for Vega-Lite visualizations. It takes the [`Vega View`](https://github.com/vega/vega/wiki/Runtime#view-component-api) and the original Vega-Lite specification as inputs. `vg.tooltip()` creates a tooltip for Vega visualizations. It takes the [`Vega View`](https://github.com/vega/vega/wiki/Runtime#view-component-api) as input. For example:

```js
// create a Vega-Lite example using vg.embed
vg.embed("#vis-scatter", embedSpec, function(error, result) {
    // result.view is the Vega View, vlSpec is the original Vega-Lite specification
    vl.tooltip(result.view, vlSpec);
});
```
or
```js
// create a Vega example using vg.parse.spec
vg.parse.spec(vgSpec, function(error, chart) {
    // view is the Vega View
    var view = chart({el:"#vis-scatter"}).update();
    vg.tooltip(view);
});
```

**Congratulations!** Now you should be able to see a tooltip working with your visualization.

Next step: [Customizing Your Tooltip](customizing_your_tooltip.md)
