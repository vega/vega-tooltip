# Creating Your Tooltip

## Step 1. Add The Library

We recommend installing the tooltip library and its dependencies via [`npm`](https://www.npmjs.com/):

```bash
npm install vega-lite-tooltip
```

The tooltip library contains a `js` file and a `css` file:

```
node_modules/vega-lite-tooltip/vl-tooltip.min.js
node_modules/vega-lite-tooltip/vl-tooltip.css
```

Alternatively, if you want to manually include the tooltip library and its dependencies, you can add the following lines to your HTML `<head>`. Vega-Lite Tooltip depends on [`d3`](https://d3js.org/), [`vega`](https://vega.github.io/vega/), [`vega-lite`](https://vega.github.io/vega-lite/), [`vega-embed`](https://github.com/vega/vega-embed) and [`datalib`](http://vega.github.io/datalib/).

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
<br>


## Step 2. Create A Visualization

In your HTML `<body>`, create a placeholder for your visualization. Give the placeholder a unique `id`, which you can later refer to in your JavaScript. For example:

```html
<!-- Placeholder for my scatter plot -->
<div id="vis-scatter"></div>
```

For [Vega-Lite](https://vega.github.io/vega-lite/): <br>
You can create your visualization using [`vg.embed`](https://github.com/vega/vega/wiki/Embed-Vega-Web-Components). Note that the following JavaScript code refers to the visualization placeholder by id selector (`#vis-scatter`).

```js
vg.embed("#vis-scatter", embedSpec, function(error, result) {
  ...
});
```

For [Vega](http://vega.github.io/vega/): <br>
You can create a visualization using [`vg.parse.spec`](https://github.com/vega/vega/wiki/Runtime). Note that the following JavaScript code refers to the visualization placeholder by id selector (`#vis-scatter`).

```js
vg.parse.spec(vgSpec, function(error, chart) {
  var view = chart({el:"#vis-scatter"}).update();
  ...
});
```
<br>


## Step 3. Create A Tooltip

In your HTML `<body>`, create a placeholder for the tooltip. Give the placeholder an `id` named `vis-tooltip` so that it can be recognized by our plugin. Assign `class` `vl-tooltip` to the tooltip placeholder so that it can pick up the default CSS style our library provides.

```html
<!-- Placeholder for the tooltip -->
<div id="vis-tooltip" class="vl-tooltip"></div>
```

> Tip: Generally speaking you will only need one tooltip placeholder per page because the mouse typically only points to one thing at a time. If you have more than one visualizations in a page, the visualizations will share one tooltip placeholder.



For [Vega-Lite](https://vega.github.io/vega-lite/): <br>
You can create your tooltip using [`vl.tooltip`](https://github.com/vega/vega-lite-tooltip/wiki/APIs#vltooltip). This function requires the [`Vega View`](https://github.com/vega/vega/wiki/Runtime#view-component-api) and the original Vega-Lite specification as inputs.

```js
vg.embed("#vis-scatter", embedSpec, function(error, result) {
  // result.view is the Vega View, vlSpec is the original Vega-Lite specification
  vl.tooltip(result.view, vlSpec);
});
```

For [Vega](http://vega.github.io/vega/): <br>
You can create your tooltip using [`vg.tooltip`](https://github.com/vega/vega-lite-tooltip/wiki/APIs#vgtooltip). This function only requires the [`Vega View`](https://github.com/vega/vega/wiki/Runtime#view-component-api) as input.

```js
vg.parse.spec(vgSpec, function(error, chart) {
  // view is the Vega View
  var view = chart({el:"#vis-scatter"}).update();
  vg.tooltip(view);
});
```
<br>


## Congratulations!

Now you should be able to see a tooltip working with your visualization.

__Next step:__ [Customizing Your Tooltip](customizing_your_tooltip.md)
