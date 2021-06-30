# Customizing Your Tooltip

__Previous Tutorial:__ [Creating Your Tooltip](creating_your_tooltip.md).

## Passing options

You can customize the tooltip by passing in an optional `options` parameter. These options are defined in [the API](APIs.md#options).

For example:

```js
var tooltipOptions = {
  theme: 'dark'
};
```

If you use Vega-Embed, you can pass your tooltip customizations  as an option.

```js
vegaEmbed("#vis", spec, {tooltip: tooltipOptions})
  .then(function(result) {
    // result.view contains the Vega view
  })
  .catch(console.error);
```

```js
var handler = new vegaTooltip.Handler(tooltipOptions);

var runtime = vega.parse(spec);
var view = new vega.View(runtime)
  .tooltip(handler.call)  // note that you have to use `handler.call`!
  .initialize(document.getElementById("vis"))
  .run();
```

## Customizing the theme

Vega tooltip has two predefined themes `light` and `dark`. You can create your own custom theme or override any of the existing CSS properties.

To use a custom theme, pass the `theme` option to Vega tooltip.

```js
var tooltipOptions = {
  theme: 'custom'
};

vegaEmbed("#vis", spec, {tooltip: tooltipOptions})
  .then(function(result) {
    // result.view contains the Vega view
  })
  .catch(console.error);
```

Then create the style for your theme.

```css
#vg-tooltip-element.vg-tooltip.custom-theme {
  color: red;
}
```

## Customizing the rendered tooltip HTML

Vega tooltip can be further customized using the `formatTooltip` option.

> It is highly recommended to follow the pattern below in sanitizing data from the `value` argument.

```js
var tooltipOptions = {
  formatTooltip: (value, sanitize) => `My custom tooltip and ${sanitize(value)}.`
};

vegaEmbed("#vis", spec, {tooltip: tooltipOptions})
  .then(function(result) {
    // result.view contains the Vega view
  })
  .catch(console.error);
```
