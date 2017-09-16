# Creating Your Tooltip

## Step 1. Add The Library

If you use [`npm`](https://www.npmjs.com/), you can install the library via:

```bash
npm install vega-tooltip
```

The tooltip library contains a `js` file and a `css` file in `build` directory:

```
vega-tooltip/build/vega-tooltip.js
vega-tooltip/build/vega-tooltip.css
```

Alternatively, you can get vega-tooltip via [`bower`](https://bower.io/):
```bash
bower install vega-tooltip
```

If you want to manually include the library and its dependencies, you can add the following lines to your HTML script tag. Vega Tooltip depends on either [`vega`](https://vega.github.io/vega/) and [`vega-lite`](https://vega.github.io/vega-lite/) depending on which one you want to include tooltip.
<br>
```html
<!-- Dependencies for Vega visualization-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/vega/2.6.5/vega.min.js"></script>

<!-- Dependencies for Vega-lite visualization-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/vega-lite/1.3.1/vega-lite.min.js"></script>

<!-- Vega Tooltip -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/vega-tooltip/0.3.3/vega-tooltip.min.js"></script>
<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/vega-tooltip/0.3.3/vega-tooltip.min.css">
```
>Note that if you use [`vega-embed`](https://github.com/vega/vega-embed/) to deploy your visualization, you need to include [`vega-embed`](https://github.com/vega/vega-embed/) dependency in script for `vega-embed` to work

```html
<!-- vega-embed -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/vega-embed/3.0.0-beta.14/vega-embed.min.js"></script>
```

## Step 2. Create A Visualization

In your HTML `<body>`, create a placeholder for your visualization. Give the placeholder a unique `id`, to which you can later refer in your JavaScript. For example:

```html
<!-- Placeholder for my scatter plot -->
<div id="vis-scatter"></div>
```

For [Vega-Lite](https://vega.github.io/vega-lite/):

You can create your visualization using [`vega.embed`](https://github.com/vega/vega/wiki/Embed-Vega-Web-Components). The following JavaScript code refers to the visualization placeholder by id selector (`#vis-scatter`).

```js
var opt = {
  mode: "vega-lite",
};
vega.embed("#vis-scatter", vlSpec, opt)
  .then(function(result) {
    ...
  })
  .catch(console.error);
```

For [Vega](http://vega.github.io/vega/):

You can create a runtime dataflow of the visualization using [`vega.parse`](https://vega.github.io/vega/docs/api/parser/), then pass this runtime dataflow to create a [`View`](https://vega.github.io/vega/docs/api/view/). Note that the following JavaScript code refers to the visualization placeholder by id selector (`#vis-scatter`).

```js
var runtime = vega.parse(Spec);
var view = new vega.View(runtime)
  .initialize(document.querySelector("#vis-scatter"))
  .hover()
  .run();
```
<br>


## Step 3. Create A Tooltip

For [Vega-Lite](https://vega.github.io/vega-lite/):

You can create your tooltip using [`vegaTooltip.vegaLite`](APIs.md#vltooltip). This function requires the [`Vega View`](https://vega.github.io/vega/docs/api/view/) and the original Vega-Lite specification as inputs.

```js
var opt = {
  mode: "vega-lite",
};
vega.embed("#vis-scatter", vlSpec, opt)
  .then(function(result) {
    // result.view is the Vega View, vlSpec is the original Vega-Lite specification
    vegaTooltip.vegaLite(result.view, vlSpec);
  })
  .catch(console.error);
```

For [Vega](http://vega.github.io/vega/):

You can create your tooltip using [`vegaTooltip.vega`](APIs.md#vgtooltip). This function only requires the [`Vega View`](https://vega.github.io/vega/docs/api/view/) as input. For example, with [`vega.embed`](https://github.com/vega/vega/wiki/Embed-Vega-Web-Components):

```js
var opt = {
  mode: "vega"
}
vega.embed(id, vgSpec, opt)
  .then(function(result) {
    // result.view is the Vega View
    vegaTooltip.vega(result.view);
  })
  .catch(console.error);
```

Another example using existing [`Vega View`](https://vega.github.io/vega/docs/api/view/) object:

```js
var runtime = vega.parse(vgSpec);
var view = new vega.View(runtime)
  .initialize(document.querySelector("#vis-scatter"))
  .hover()
  .run();

vegaTooltip.vega(view);
```

The tooltip will not appear for marks whose [`interactive`](https://vega.github.io/vega/docs/marks/) property is `false`.
<br>
> [`vega-tooltip`](https://github.com/vega/vega-tooltip/) will automatically generate a placeholder for tooltip with `vis-tooltip` as an `id` and `vg-tooltip` as a `class` name.


## Congratulations!

Now you should be able to see a tooltip working with your visualization.

__Next step:__ [Customizing Your Tooltip](customizing_your_tooltip.md)
