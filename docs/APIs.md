# Constructors

## [vg.tooltip](#vgtooltip)

`vg.tooltip(vgView[, options])`

| Parameter       | Type           | Description     |
| :-------------- |:--------------:| :-------------- |
| `vgView`        | [Vega View](https://github.com/vega/vega/wiki/Runtime#view-component-api) | The visualization view. |
| `options`       | Object         | Options to customize the tooltip. See [options](#options) for details. |

__Returns:__ [`tooltip`](#tooltip) object

## [vl.tooltip](#vltooltip)

`vl.tooltip(vgView, vlSpec[, options])`

| Parameter       | Type           | Description     |
| :-------------- |:--------------:| :-------------- |
| `vgView`        | [Vega View](https://github.com/vega/vega/wiki/Runtime#view-component-api) | The visualization view. |
| `vlSpec`        | Object         | The Vega-Lite specification of the visualization. |
| `options`       | Object         | Options to customize the tooltip. See [options](#options) for details. |

__Returns:__ [`tooltip`](#tooltip) object

## [options](#options)

`options` can customize the content and look of the tooltip. Here is a template of `options`. All of its properties are optional.

```js
var options =
{
  showAllFields: true | false,
  fields: [
    {
      field: "field1",
      title: "Field One",
      formatType: "time" | "number" | "string",
      format: string-specifier,
      aggregate: operation,
    },
    ...
  }],
  delay: 250,
  onAppear: function(event, item) { /* callback */ },
  onMove: function(event, item) { /* callback */ },
  onDisappear: function(event, item) { /* callback */ },
  colorTheme: "light" | "dark"
};
```

| Property        | Type           | Description     |
| :-------------- |:--------------:| :-------------- |
| `showAllFields` | Boolean        | If `true`, show all data fields of a visualization in the tooltip. If `false`, only show fields specified in the `fields` array in the tooltip. <br>__Default value:__ `true`|
| `fields`        | Array          | An array of fields to be displayed in the tooltip when `showAllFields` is `false`. |
| `delay`         | Number         | Number of milliseconds tooltip display should be delayed. <br>__Default value:__ 100 milliseconds.|
| `onAppear`      | function(event, item) | Callback when tooltip first appears (when mouse moves over a new item in visualization). |
| `onMove`        | function(event, item) | Callback when tooltip moves (e.g., when mouse moves within a bar). |
| `onDisappear`   | function(event, item) | Callback when tooltip disappears (when mouse moves out an item). |
| `colorTheme`    | String         | A color theme picker. <br>__Supported values:__ `"light"` and `"dark"`. <br>__Default value:__ `"light"` <br>To further customize, overwrite the `.vl-tooltip` class in your CSS. |

> Tip: You can customize the order of the fields in your tooltip by setting `showAllFields` to `false` and providing a `fields` array. Your tooltip will display fields in the order they appear in the `fields` array.

<br>

Each member in the `fields` array can customize the format of a field. These custom formats are applied whenever applicable (no matter `showAllFields` is `true` or `false`).

| Property        | Type           | Description     |
| :-------------- |:--------------:| :-------------- |
| `field`         | String         | The unique name of the field. With Vega-Lite, this is the field you provided to each encoding channel. |
| `title`         | String         | A custom title for the field. |
| `formatType`    | String         | Tells what kind of field this is (for formatting the field value in the tooltip) <br>__Supported values:__ `"number"`, `"time"`, and `"string"`. |
| `format`        | String         | A string specifier for formatting the field value in the tooltip. If `formatType` is `"number"`, you can provide a [number format string-specifier](https://github.com/mbostock/d3/wiki/Formatting). If `formatType` is `"time"`, you can provide a [time format string-specifier](https://github.com/mbostock/d3/wiki/Time-Formatting). If `formatType` is `"string"`, there is no need to provide a `format`. |
| `aggregate`     | String         | (Vega-Lite only) If your Vega-Lite visualization has multiple aggregations of the same field, you can specify the aggregation to identify the particular aggregated field. <br>__Supported values:__ [Vega-Lite aggregate operations](https://vega.github.io/vega-lite/docs/aggregate.html#supported-aggregation-operations)|

# [tooltip Object](#tooltip)

| Method          | Parameter(s)   | Description     |
| :-------------- |:--------------:| :-------------- |
| .destroy        | none           | unregister tooltip event listners on `vgView` |
