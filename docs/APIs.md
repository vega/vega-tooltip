# Constructors

## [vegaTooltip](#tooltip)

`vegaTooltip(view [, options])`

| Parameter       | Type           | Description     |
| :-------------- |:--------------:| :-------------- |
| `view`          | [Vega View](vega.github.io/vega/docs/api/view) | The visualization view. |
| `options`       | Object         | Options to customize the tooltip. See [options](#options) for details. |

__Returns:__ [`return`](#return) object

## [options](#options)

`options` can customize the tooltip. Here is a template of `options`. All of its properties are optional.

The default values are:

```js
var options =
{
  offsetX: 10,
  offsetY: 10,
  id: 'vg-tooltip-element',
  theme: 'light',
  disableDefaultStyle: false
};
```

| Property        | Type           | Description     |
| :-------------- |:--------------:| :-------------- |
| `offsetX`       | Number         | The horizontal offset. |
| `offsetY`       | Number         | The vertical offset. |
| `id`            | String         | The id of the tooltip element. The default name is `vg-tooltip-element`. |
| `theme`         | String         | A color theme. <br>__Supported values:__ `"light"`, `"dark"`, or a custom name. <br>__Default value:__ `"light"` <br>To cusotmize your own theme, create CSS for the `[THEME]-theme` class. |
| `disableDefaultStyle` | Boolean  | Disable the default style completely. |

# [Return Object](#return)

| Method          | Parameter(s)   | Description     |
| :-------------- |:--------------:| :-------------- |
| .destroy        | none           | Unregister tooltip event listeners on the Vega view |
