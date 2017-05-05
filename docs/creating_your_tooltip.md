# Creating Your Tooltip

## Step 1. Add The Library

We recommend installing vega-tooltip and its dependencies via [`npm`](https://www.npmjs.com/):

```bash
npm install vega-tooltip
```

The tooltip library contains a `js` file and a `css` file:

```
vega-tooltip/build/vg-tooltip.js
vega-tooltip/build/vg-tooltip.css
```

Alternatively, you can get vega-tooltip via [`bower`](https://bower.io/):
```bash
bower install vega-tooltip
```

If you want to manually include the tooltip library and its dependencies, you can add the following lines to your HTML `<head>`. Vega Tooltip depends on [`d3`](https://d3js.org/), [`vega`](https://vega.github.io/vega/), [`vega-lite`](https://vega.github.io/vega-lite/), [`vega-embed`](https://github.com/vega/vega-embed) and [`datalib`](http://vega.github.io/datalib/).

```html
<!-- Dependencies -->
<script src="https://d3js.org/d3.v3.min.js"></script>
<script src="https://vega.github.io/vega/vega.min.js"></script>
<script src="https://vega.github.io/vega-lite/vega-lite.min.js"></script>
<script src="https://vega.github.io/vega-editor/vendor/vega-embed.min.js"></script>
<script src="https://vega.github.io/datalib/datalib.min.js"></script>

<!-- Vega Tooltip -->
<script src="https://vega.github.io/vega-tooltip/vg-tooltip.min.js"></script>
<link rel="stylesheet" type="text/css" href="https://vega.github.io/vega-tooltip/vg-tooltip.css">
```
<br>


## Step 2. Create A Visualization

In your HTML `<body>`, create a placeholder for your visualization. Give the placeholder a unique `id`, which you can later refer to in your JavaScript. For example:

```html
<!-- Placeholder for my scatter plot -->
<div id="vis-scatter"></div>
```

For [Vega-Lite](https://vega.github.io/vega-lite/):

You can create your visualization using [`vega.embed`](https://github.com/vega/vega/wiki/Embed-Vega-Web-Components). Note that the following JavaScript code refers to the visualization placeholder by id selector (`#vis-scatter`).

```js
var embedSpec = {
  mode: "vega-lite",
  spec: vlSpec
};
vega.embed("#vis-scatter", embedSpec, function(error, result) {
  ...
});
```

For [Vega](http://vega.github.io/vega/):

You can create a runtime dataflow of the visualization using [`vega.parse`](https://vega.github.io/vega/docs/api/parser/), then pass this runtime dataflow to create a [`View`](https://vega.github.io/vega/docs/api/view/). Note that the following JavaScript code refers to the visualization placeholder by id selector (`#vis-scatter`).

```js
var runtime = vega.parse(vgSpec);
var view = new vega.View(runtime)
  .initialize(document.querySelector("#vis-scatter"))
  .hover()
  .run();
```
<br>


## Step 3. Create A Tooltip

In your HTML `<body>`, create a placeholder for the tooltip. Give the placeholder an `id` named `vis-tooltip` so that it can be recognized by our plugin. Assign `class` `vg-tooltip` to the tooltip placeholder so that it can pick up the default CSS style our library provides.

```html
<!-- Placeholder for the tooltip -->
<div id="vis-tooltip" class="vg-tooltip"></div>
```

> Tip: Generally, you will only need one tooltip placeholder per page because the mouse typically only points to one thing at a time. If you have more than one visualizations in a page, the visualizations will share one tooltip placeholder.



For [Vega-Lite](https://vega.github.io/vega-lite/):

You can create your tooltip using [`vegaTooltip.vegaLite`](APIs.md#vltooltip). This function requires the [`Vega View`](https://vega.github.io/vega/docs/api/view/) and the original Vega-Lite specification as inputs.

```js
var opt = {
  mode: "vega-lite",
};
vega.embed("#vis-scatter", vlSpec, opt, function(error, result) {
  // result.view is the Vega View, vlSpec is the original Vega-Lite specification
  vegaTooltip.vegaLite(result.view, vlSpec);
});
```

For [Vega](http://vega.github.io/vega/):

You can create your tooltip using [`vegaTooltip.vega`](APIs.md#vgtooltip). This function only requires the [`Vega View`](https://vega.github.io/vega/docs/api/view/) as input. For example:

```js
var embedSpec = {
  spec: vgSpec
}
vega.embed(id, embedSpec, function(error, result) {
  // result.view is the Vega View
  vegaTooltip.vega(result.view, options);
});
```

Another example using existing [`Vega View`](https://vega.github.io/vega/docs/api/view/) object:

```js
var runtime = vega.parse(vgSpec);
var view = new vega.View(runtime)
  .initialize(document.querySelector("#vis-scatter"))
  .hover()
  .run();

vegaTooltip.vega(view, options);
```
<br>


## Congratulations!

Now you should be able to see a tooltip working with your visualization.

__Next step:__ [Customizing Your Tooltip](customizing_your_tooltip.md)
