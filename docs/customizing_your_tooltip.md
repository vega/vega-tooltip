# Customizing Your Tooltip

__Previous Tutorial:__ [Creating Your Tooltip](creating_your_tooltip.md).

You can customize the content and look of your tooltip by passing in an optional `options` parameter to the tooltip API.

For [Vega-Lite](https://vega.github.io/vega-lite/):

```js
var opt = {
  mode: "vega-lite",
};
vegaEmbed("#vis-scatter", vlSpec, opt)
  .then(function (result) {
    // result.view is the Vega View, vlSpec is the original Vega-Lite specification
    vegaTooltip.vegaLite(result.view, vlSpec, options); // pass in options
  })
  .catch(console.error);
```

For [Vega](http://vega.github.io/vega/):

```js
var runtime = vega.parse(vgSpec);
var view = new vega.View(runtime)
  .initialize(document.querySelector(id))
  .hover()
  .run();
vegaTooltip.vega(view, options); // pass in options
```


## Options
<!-- TODO(zening): The complete structure of options is now documented in our "APIs" page (docs/APIs.md#options). We can use this section to give some concrete examples of using options to customize fields. (issue #40)-->

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
| `colorTheme`    | String         | A color theme picker. <br>__Supported values:__ `"light"` and `"dark"`. <br>__Default value:__ `"light"` <br>To further customize, overwrite the `.vg-tooltip` class in your CSS. |
| `sort`          | String | function | Sort fields on `'title'`, `'value'` of the field, or pass a custom sort(a, b) function. The sort order for `'title'` and `'value'` is as follows: <ul><li>Dates and strings are sorted ascending, numbers descending.</li><li>Dates appear first, then numbers, then strings.</li></ul> |

> Tip: You can customize the order of the fields in your tooltip by setting `showAllFields` to `false` and providing a `fields` array. Your tooltip will display fields in the order they appear in the `fields` array. Alternatively, use the `sort` property to dynamically determine sorting for each mark.

<br>

Each member in the `fields` array can customize the format of a field. These custom formats are applied whenever applicable (no matter `showAllFields` is `true` or `false`).

| Property        | Type           | Description     |
| :-------------- |:--------------:| :-------------- |
| `field`         | String         | The unique name of the field. With Vega-Lite, this is the field you provided to each encoding channel. |
| `title`         | String | function         | A custom title for the field, or an accessor function that generates it from the scenegraph datum. |
| `formatType`    | String         | Tells what kind of field this is (for formatting the field value in the tooltip) <br>__Supported values:__ `"number"`, `"time"`, and `"string"`. |
| `format`        | String | function         | A string specifier for formatting the field value in the tooltip. If `formatType` is `"number"`, you can provide a [number format string-specifier](https://github.com/d3/d3-format#locale_format). If `formatType` is `"time"`, you can provide a [time format string-specifier](https://github.com/d3/d3-time-format#locale_format). If `formatType` is `"string"`, there is no need to provide a `format`. Alternatively, `format` can be passed as a function that returns a string, in which case `formatType` is ignored. |
| `valueAccessor` | function       | An accessor function to generate the field value from the scenegraph datum. |
| `aggregate`     | String         | (Vega-Lite only) If your Vega-Lite visualization has multiple aggregations of the same field, you can specify the aggregation to identify the particular aggregated field. <br>__Supported values:__ [Vega-Lite aggregate operations](https://vega.github.io/vega-lite/docs/aggregate.html#supported-aggregation-operations)|
>If `format` is not specified, each `field` will be auto-formatted based on its type. If `field` is a whole number, it will be formatted as a whole number. If `field` is a decimal, it will be formatted to two digits precision. If `field` is `time`, it will be formatted using [`multi-scale time format`](https://bl.ocks.org/mbostock/4149176)
