# Tooltip for Vega & Vega-Lite
[![npm version](https://img.shields.io/npm/v/vega-tooltip.svg)](https://www.npmjs.com/package/vega-tooltip)
[![](https://data.jsdelivr.com/v1/package/npm/vega-tooltip/badge?style=rounded)](https://www.jsdelivr.com/package/npm/vega-tooltip)
[![Build Status](https://travis-ci.org/vega/vega-tooltip.svg?branch=master)](https://travis-ci.org/vega/vega-tooltip)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=rounded)](https://github.com/prettier/prettier) [![Greenkeeper badge](https://badges.greenkeeper.io/vega/vega-tooltip.svg)](https://greenkeeper.io/)


A tooltip plugin for [Vega](http://vega.github.io/vega/) and [Vega-Lite](https://vega.github.io/vega-lite/) visualizations. This plugin implements a [custom tooltip handler](https://vega.github.io/vega/docs/api/view/#view_tooltip) for Vega that uses custom HTML tooltips instead of the HTML [`title` attribute](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/title). Vega Tooltip is installed in the [Vega Editor](https://vega.github.io/editor/).

**Vega Tooltip 0.9 and above use a new API as described below. Learn what has changed at https://github.com/vega/vega-tooltip/wiki/Changes-in-Vega-Tooltip-0.9.**

![demo image](demo.png "a tooltip for a Vega-Lite scatterplot")

## Demo

http://vega.github.io/vega-tooltip/

## Installing

### NPM or Yarn

Use `npm install vega-tooltip` or `yarn add vega-tooltip`.

### Using Vega-tooltip with a CDN

You can import `vega-tooltip` directly from [`jsDelivr`](https://www.jsdelivr.com/package/npm/vega-tooltip). Replace `[VERSION]` with the version that you want to use.

```html
<!-- Import Vega 3 & Vega-Lite 2 (does not have to be from CDN) -->
<script src="https://cdn.jsdelivr.net/npm/vega@3"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-lite@2"></script>

<script src="https://cdn.jsdelivr.net/npm/vega-tooltip@[VERSION]"></script>
```

## Usage and APIs

If you use [Vega-Embed](https://github.com/vega/vega-embed), you **don't need to install Vega Tooltip**! Vega Embed already comes with Vega Tooltip. You can however pass tooltip customizations.

```js
vegaEmbed("#vis", spec, {tooltip: {theme: 'dark'}})
  .then(function(result) {
    // result.view contains the Vega view
  })
  .catch(console.error);
```

If you want to ue a different version of the tooltip handler, you can override the default handler with the handler from Vega Tooltip (and you need to install it separately).

```js
var handler = new vegaTooltip.Handler();
vegaEmbed("#vis", spec, {tooltip: handler.call})
  .then(function(result) {
    // result.view contains the Vega view
  })
  .catch(console.error);
```

See the [API documentation](docs/APIs.md) for details.

## Tutorials

1. [Creating Your Tooltip](docs/creating_your_tooltip.md)
2. [Customizing Your Tooltip](docs/customizing_your_tooltip.md)

## Run Instructions

1. In the project folder `vega-tooltip`, type command `yarn` to install dependencies.
2. Then, type `yarn start`. This will build the library and start a web server.
3. In your browser, navigate to `http://localhost:8000/`, where you can see various Vega-Lite and Vega visualizations with tooltip interaction.

## Release Process

To release a new version, make sure that everything works. Then run `yarn version` and bump the version number. Lastly, push to GitHub (with the release tag). [Travis](https://travis-ci.org/vega/vega-tooltip/builds) will build a bundle and make the [npm release](https://www.npmjs.com/package/vega-tooltip) automatically.
