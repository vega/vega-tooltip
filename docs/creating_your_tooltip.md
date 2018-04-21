# Creating Your Tooltip

## Step 1. Add The Library

If you use [`yarn`](https://yarnpkg.com/), you can install the library via:

```bash
yarn add vega-tooltip
```

The tooltip library has the compiled tooltip library in the `build` directory:

```
vega-tooltip/build/vega-tooltip.js
```

If you want to manually include the library and its dependencies, you can add the following lines to your HTML script tag. Vega Tooltip works with [`vega`](https://vega.github.io/vega/) and [`vega-lite`](https://vega.github.io/vega-lite/).

```html
<script src="https://cdn.jsdelivr.net/npm/vega@3"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-lite@2"></script>

<!-- Vega Tooltip -->
<script src="https://cdn.jsdelivr.net/npm/vega-tooltip"></script>
```
>Note that if you use [Vega-Embed](https://github.com/vega/vega-embed/) to deploy your visualization, you need to include it as a dependency

```html
<!-- vega-embed -->
<script src="https://cdn.jsdelivr.net/npm/vega-embed@3"></script>
```

Instead of including Vega Tooltip as a script, you can import it in your bundle. 

```js
import vegaTooltip from 'vega-tooltip';
```

## Step 2. Create A Visualization

In your HTML `<body>`, create a placeholder for your visualization. Give the placeholder a unique `id`, to which you can later refer in your JavaScript. For example:

```html
<!-- Placeholder for my plot -->
<div id="vis"></div>
```

You can create your visualization using [`vegaEmbed`](https://github.com/vega/vega-embed). The following JavaScript code refers to the visualization placeholder by id selector (`#vis`). The spec can be a Vega or Vega-Lite specification.

```js
vegaEmbed("#vis", spec)
  .then(function(result) {
    ... // Add tooltip here as shown below
  })
  .catch(console.error);
```

Alternatively, you can create a runtime dataflow of the visualization using [`vega.parse`](https://vega.github.io/vega/docs/api/parser/), then pass this runtime dataflow to create a [`View`](https://vega.github.io/vega/docs/api/view/). Note that the following JavaScript code refers to the visualization placeholder by id selector (`#vis`).

```js
var runtime = vega.parse(spec);
var view = new vega.View(runtime)
  .initialize(document.querySelector("#vis"))
  .hover()
  .run();

// Add tooltip here as shown below
```
<br>


## Step 3. Set up the tooltip library

For [Vega-Lite](https://vega.github.io/vega-lite/) and [Vega](http://vega.github.io/vega/):

You can create your tooltip using [`vegaTooltip`](APIs.md#tooltip). This function requires the [`Vega View`](https://vega.github.io/vega/docs/api/view/) as input.

```js
vegaEmbed("#vis", spec, opt)
  .then(function(result) {
    // result.view is the Vega View
    vegaTooltip(result.view);
  })
  .catch(console.error);
```

If you get an error `vegaTooltip is not a function`, try to replace `vegaTooltip` with `vegaTooltip.default`. This is not necessary when you bundle your code with webpack, browserify, or rollup.

Another example using existing [`Vega View`](https://vega.github.io/vega/docs/api/view/) object without Vega Embed:

```js
var runtime = vega.parse(spec);
var view = new vega.View(runtime)
  .initialize(document.querySelector("#vis"))
  .hover()
  .run();

vegaTooltip(view);
```

## Step 4. Define your tooltip in Vega or Vega-Lite

**You will not see a tooltip if you skip this step.**

You have to define the tooltip property in Vega or Vega-Lite. Note that if you don't use `vega-tooltip`, Vega will use native tooltips instead. Vega Tooltip automatically formats the data. Literal values are coerced to strings. Arrays will be shown in line. For Object values, each key-value pair is displayed in its own row in a table.

### In Vega

In a Vega spec, you need to set the `tooltip` property on the mark for which you want to set a tooltip. 

For example, in your spec you might define a tooltip like this:

```json
...
"tooltip": {"signal": "{'Unemployment Rate': format(datum.unemp.rate, '0.1%')}"}
...
```

See [exampleSpecs/choropleth.json](https://github.com/vega/vega-tooltip/blob/master/exampleSpecs/choropleth.json) for an example.

### In Vega-Lite

See https://vega.github.io/vega-lite/docs/tooltip.html#using-tooltip-channel for details on how to use the tooltip channel.

## Congratulations!

Now you should be able to see a tooltip working with your visualization.

__Next step:__ [Customizing Your Tooltip](customizing_your_tooltip.md)
