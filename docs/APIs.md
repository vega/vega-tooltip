# Constructors

## [vegaTooltip](#tooltip)

`vegaTooltip(view [, options])`

| Parameter       | Type           | Description     |
| :-------------- |:--------------:| :-------------- |
| `view`          | [Vega View](https://github.com/vega/vega/wiki/Runtime#view-component-api) | The visualization view. |
| `options`       | Object         | Options to customize the tooltip. See [options](#options) for details. |

__Returns:__ [`return`](#return) object

## [options](#options)

`options` can customize the tooltip. Here is a template of `options`. All of its properties are optional.

```js
var options =
{
  /**
   * X offset.
   */
  offsetX: 10,

  /**
   * Y offset.
   */
  offsetY: 10,

  /**
   * If of the tooltip element.
   */
  id: 'vg-tooltip-element',

  /**
   * The name of the theme. You can use the CSS class called [THEME]-theme to style the tooltips.
   * 
   * There are two predefined themes: "light" (default) and "dark".
   */
  theme: 'light'
};
```

| Property        | Type           | Description     |
| :-------------- |:--------------:| :-------------- |
| `offsetX`       | Number         | The horizontal offset. |
| `offsetY`       | Number         | The vertical offset. |
| `id`            | String         | The id of the tooltip element. The default name is `vg-tooltip-element`. |
| `theme`         | String         | A color theme. <br>__Supported values:__ `"light"`, `"dark"`, or a custom name. <br>__Default value:__ `"light"` <br>To cusotmize your own theme, create CSS for the `[THEME]-theme` class. |

# [Return Object](#return)

| Method          | Parameter(s)   | Description     |
| :-------------- |:--------------:| :-------------- |
| .destroy        | none           | Unregister tooltip event listeners on the Vega view |
