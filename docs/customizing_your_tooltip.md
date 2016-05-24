# Customizing Your Tooltip

__Previous Tutorial:__ [Creating Your Tooltip](creating_your_tooltip.md).

You can customize the content and look of your tooltip by passing in an optional `options` parameter to the tooltip API.

For [Vega-Lite](https://vega.github.io/vega-lite/):

```js
var embedSpec = {
  mode: "vega-lite",
  spec: vlSpec
};
vg.embed("#vis-scatter", embedSpec, function(error, result) {
  // result.view is the Vega View, vlSpec is the original Vega-Lite specification
  vl.tooltip(result.view, vlSpec, options); // pass in options
});
```

For [Vega](http://vega.github.io/vega/):

```js
vg.parse.spec(vgSpec, function(error, chart) {
  // view is the Vega View
  var view = chart({el:"#vis-scatter"}).update();
  vg.tooltip(view, options); // pass in options
});
```


## Options
<!-- TODO(zening): The complete structure of options is now documented in our "APIs" page (https://github.com/vega/vega-lite-tooltip/wiki/APIs#options). We can use this section to give some concrete examples of using options to customize fields. (issue #40)-->

Here is a template of `options`. All of its properties are optional. `options` itself is optional too.

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
  colorTheme: "light" | "dark"
};
```

| Property        | Type           | Description     |
| :-------------- |:--------------:| :-------------- |
| `showAllFields` | Boolean        | If `true`, show all data fields of a visualization in the tooltip. If `false`, only show fields specified in the `fields` array in the tooltip. <br>__Default value:__ `true`|
| `fields`        | Array          | An array of fields to be displayed in the tooltip when `showAllFields` is `false`. |
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

