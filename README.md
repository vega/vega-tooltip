# Tooltip for Vega & Vega-Lite
A tooltip plugin for [Vega](http://vega.github.io/vega/) and [Vega-Lite](https://vega.github.io/vega-lite/) visualizations.

![demo image](demo.png "a tooltip for a Vega-Lite scatterplot")


## Author
The development of Vega Tooltip is led by Zening Qu, with significant help from [Kanit "Ham" Wongsuphasawat](https://twitter.com/kanitw) and [Dominik Moritz](https://twitter.com/domoritz).


## Demo
http://vega.github.io/vega-tooltip/

## APIs
For Vega-Lite: [`vl.tooltip(vgView, vlSpec[, options])`](docs/APIs.md#vltooltip)

For Vega: [`vg.tooltip(vgView[, options])`](docs/APIs.md#vgtooltip)

## Tutorials
1. [Creating Your Tooltip](docs/creating_your_tooltip.md)
2. [Customizing Your Tooltip](docs/customizing_your_tooltip.md)

## Run Instructions
1. In the project folder `vega-tooltip`, type command `npm install` to install dependencies.
2. Then, type `npm start`. This will build the library and start a web server.
3. In your browser, navigate to `http://localhost:4000/`, where you can see various Vega-Lite and Vega visualizations with tooltip interaction.
