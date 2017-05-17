# Tooltip for Vega & Vega-Lite
[![npm version](https://img.shields.io/npm/v/vega-tooltip.svg)](https://www.npmjs.com/package/vega-tooltip)

A tooltip plugin for [Vega](http://vega.github.io/vega/) and [Vega-Lite](https://vega.github.io/vega-lite/) visualizations.

The current version works with Vega 3 and Vega-Lite 2. For Vega 2 and Vega-Lite 1, use the [old version of Vega-Tooltip](https://github.com/vega/vega-tooltip/releases/tag/v0.1.3).

![demo image](demo.png "a tooltip for a Vega-Lite scatterplot")


## Author

Vega Tooltip was built by Zening Qu and Sira Horradarn, with significant help from [Dominik Moritz](https://twitter.com/domoritz) and [Kanit "Ham" Wongsuphasawat](https://twitter.com/kanitw).


## Demo
http://vega.github.io/vega-tooltip/

## APIs
For Vega-Lite: [`vegaTooltip.vegaLite(vgView, vlSpec[, options])`](docs/APIs.md#vltooltip)

For Vega: [`vegaTooltip.vega(vgView[, options])`](docs/APIs.md#vgtooltip)

## Tutorials
1. [Creating Your Tooltip](docs/creating_your_tooltip.md)
2. [Customizing Your Tooltip](docs/customizing_your_tooltip.md)

## Run Instructions
1. In the project folder `vega-tooltip`, type command `npm install` to install dependencies.
2. Then, type `npm start`. This will build the library and start a web server.
3. In your browser, navigate to `http://localhost:8000/`, where you can see various Vega-Lite and Vega visualizations with tooltip interaction.
