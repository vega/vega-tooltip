# Creating Your Tooltip

## Step 1. Add The Library

If you use [`yarn`](https://yarnpkg.com/), you can install the library via:

```bash
yarn add vega-tooltip
```

With npm, you can install it as

```bash
npm install vega-tooltip
```

The tooltip library has the compiled tooltip library in the `build` directory:

```
vega-tooltip/build/vega-tooltip.js
```

If you want to manually include the library and its dependencies, you can add the following lines to your HTML script tag. Vega Tooltip works with [`vega`](https://vega.github.io/vega/) and [`vega-lite`](https://vega.github.io/vega-lite/).

```html
<script src="https://cdn.jsdelivr.net/npm/vega@5"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-lite@4"></script>

<!-- Vega Tooltip -->
<script src="https://cdn.jsdelivr.net/npm/vega-tooltip"></script>
```
> **Note that if you use [Vega-Embed](https://github.com/vega/vega-embed/) to deploy your visualization, you already have Vega Tooltip and don't need to do anything.**

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

Alternatively, you can create a runtime dataflow of the visualization using [`vega.parse`](https://vega.github.io/vega/docs/api/parser/), then pass this runtime dataflow to create a [`View`](https://vega.github.io/vega/docs/api/view/). Note that the following JavaScript code refers to the visualization placeholder by id selector (`#vis`).

```js
var runtime = vega.parse(spec);
var view = new vega.View(runtime)
  .initialize(document.getElementById("vis"))
  .run();
```
<br>


## Step 3. Set up the tooltip library

For [Vega-Lite](https://vega.github.io/vega-lite/) and [Vega](http://vega.github.io/vega/). First, create the [tooltip handler](https://vega.github.io/vega/docs/api/view/#view_tooltip).

```js
var handler = new vegaTooltip.Handler();
```

Then register it when you initialize the view.

```js
var runtime = vega.parse(spec);
var view = new vega.View(runtime)
  .tooltip(handler.call)  // note that you have to use `handler.call`!
  .initialize(document.getElementById("vis"))
  .run();
```

You can create your tooltip using [`vegaTooltip`](APIs.md#tooltip) if you don't have access to the initialization. This function requires the [`Vega View`](https://vega.github.io/vega/docs/api/view/) as input.

If you get an error `vegaTooltip is not a function`, try to replace `vegaTooltip` with `vegaTooltip.default`. This is not necessary when you bundle your code with webpack, browserify, or rollup.

```js
var runtime = vega.parse(spec);
var view = new vega.View(runtime)
  .initialize(document.getElementById("vis"))
  .run();

vegaTooltip(view);
```

## Step 4. Define your tooltip in Vega or Vega-Lite

**You will not see a tooltip if you skip this step.**

You have to define the tooltip property in Vega or Vega-Lite. Note that if you don't use `vega-tooltip`, Vega will use native tooltips instead. Vega Tooltip automatically formats the data. Literal values are coerced to strings. Arrays will be shown in line. For object values, each key-value pair is displayed in its own row in a table.

Vega tooltip handles some keys in object valued tooltips differently. For example, a field called `title` automatically becomes the title of the tooltip. A field called `image` automatically adds an embedded image that uses the field value as the URL.

### In Vega

In a Vega spec, you need to set the `tooltip` property on the mark for which you want to set a tooltip.  If the value is on object, Vega Tooltip renders a table with one row for each key. The value with key `title` will not be shown as a row but instead is rendered as a heading in the tooltip.

For example, in your spec you might define a tooltip like this:

```json
...
"tooltip": {"signal": "{'Unemployment Rate': format(datum.unemp.rate, '0.1%')}"}
...
```

See [examples/specs/choropleth.json](https://github.com/vega/vega-tooltip/blob/master/examples/specs/choropleth.json) for an example.

### In Vega-Lite

See https://vega.github.io/vega-lite/docs/tooltip.html#using-tooltip-channel for details on how to use the tooltip channel.

## Congratulations!

Now you should be able to see a tooltip working with your visualization.

__Next step:__ [Customizing Your Tooltip](customizing_your_tooltip.md)
