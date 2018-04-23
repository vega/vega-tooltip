# Customizing Your Tooltip

__Previous Tutorial:__ [Creating Your Tooltip](creating_your_tooltip.md).

## Passing options

You can customize the tooltip by passing in an optional `options` parameter. These options are defined in [the API](API.md#options).

For example:

```js
var options = {
  theme: 'dark'
};

vegaEmbed("#vis", spec)
  .then(function (result) {
    vegaTooltip.default(result.view, options); // pass in options
  })
  .catch(console.error);
```

## Customizing the theme

Vega tooltip has two predefined themes `light` and `dark`. You can create your own custom theme or override any of the existing CSS properties. 

To use a custom theme, pass the `theme` option to Vega tooltip.

```js
var options = {
  theme: 'custom'
};

vegaEmbed("#vis", spec)
  .then(function (result) {
    vegaTooltip.default(result.view, options); // pass in options
  })
  .catch(console.error);
```

Then create the style for your theme. 

```css
.vg-tooltip.custom-theme {
  color: red;
}
```
