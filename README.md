# Tooltip for Vega & Vega-Lite
[![npm version](https://img.shields.io/npm/v/vega-tooltip.svg)](https://www.npmjs.com/package/vega-tooltip)

A tooltip plugin for [Vega](http://vega.github.io/vega/) and [Vega-Lite](https://vega.github.io/vega-lite/) visualizations. This plugin implements a [custom tooltip handler](https://vega.github.io/vega/docs/api/view/#view_tooltip) for Vega that uses custom HTML tooltips instead of the HTML [`title` attribute](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/title).

![demo image](demo.png "a tooltip for a Vega-Lite scatterplot")

## Demo

http://vega.github.io/vega-tooltip/

## Installing

### Yarn

If you use Yarn, run command `yarn add vega-tooltip`.

### Using Vega-tooltip with a CDN

You can import `vega-tooltip` directly from [`jsDelivr`](https://www.jsdelivr.com/package/npm/vega-tooltip). Replace `[VERSION]` with the version that you want to use.

```html
<!-- Import Vega 3 & Vega-Lite 2 (does not have to be from CDN) -->
<script src="https://cdn.jsdelivr.net/npm/vega@3"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-lite@2"></script>

<script src="https://cdn.jsdelivr.net/npm/vega-tooltip@[VERSION]"></script>
```

## APIs

[`vegaTooltip(view[, options])`](docs/APIs.md#tooltip)

## Tutorials
1. [Creating Your Tooltip](docs/creating_your_tooltip.md)
2. [Customizing Your Tooltip](docs/customizing_your_tooltip.md)
3. [Examples and Code on `bl.ocks.org`](https://bl.ocks.org/sirahd)

## Run Instructions

1. In the project folder `vega-tooltip`, type command `yarn` to install dependencies.
2. Then, type `yarn start`. This will build the library and start a web server.
3. In your browser, navigate to `http://localhost:8000/`, where you can see various Vega-Lite and Vega visualizations with tooltip interaction.
