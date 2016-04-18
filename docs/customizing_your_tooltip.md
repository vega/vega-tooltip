# Customizing Your Tooltip
If you are looking at this page, you should already have created a default tooltip. If you haven't, please read [Creating Your Tooltip](creating_your_tooltip.md).

You can customize the look and the content of your tooltip by passing in an optional `options` parameter to `vl.tooltip()` or `vg.tooltip()`. For example:

```js
// in vg.embed callback
vl.tooltip(result.view, vlSpec, options);
```
or
```js
// in vg.parse.spec callback
vg.tooltip(view, options);
```

The complete structure of `options` looks like this:

```js
var options =
{
    showAllFields: true | false,
    fields: [
      {
         field: 'field1',
         title: 'Field One',
         formatType: 'time' | 'number' | 'string', 			
         format: string-specifier,
         aggregate: operation,
      },
      ...
    }],
    colorTheme: 'light' | 'dark'
};
```

You don't have to provide a fully-structured `options` object to customize your tooltip. In most cases, a partially filled-out `options` object should suffice.

| Option | Description |
| :------| :-----------|
| `showAllFields` | A boolean that specifies whether tooltip should show all fields or only fields in the `options.fields[]` array. If `showAllFields` is `true`, tooltip shows all fields bind to the mark being hovered. The order of the fields in the tooltip is the order they are bind to the mark item. If `showAllFields` is `false`, tooltip only shows fields specified in the `fields[]` array. The order of the fields in the tooltip is the same as the order specified in the `fields[]` array. `showAllFields` defaults to `true`. |
| `fields` | An array of objects that customize the title and format of fields. When `showAllFields` is `false`, only fields in this array will be shown in the tooltip. When `showAllFields` is `true`, the `fields[]` array can still provide custom titles and formats for its member fields. |
| `colorTheme` | A string theme picker. By default, tooltip uses a `'light'` color theme. Tooltip also provides a `'dark'` color theme. To further customize, you can overwrite the `.vg-tooltip` class in your CSS. |

Each object in the `fields[]` array has the following properties.

| Property | Description |
| :--------| :-----------|
| `field` | The name of the field. With Vega-Lite, this is the field you provided to each encoding channel. |
| `title` | A custom string title for the field. |
| `formatType` | Tells what kind of field this is: `'number'`, `'time'`, or `'string'`. |
| `format` | If `formatType` is `'number'`, you can provide a [number format string-specifier](https://github.com/mbostock/d3/wiki/Formatting). If `formatType` is `'time'`, you can provide a [time format string-specifier](https://github.com/mbostock/d3/wiki/Time-Formatting). If `formatType` is `'string'`, there is no need to provide a `format`. |
| `aggregate` | (Vega-Lite only) If your Vega-Lite visualization has multiple aggregations of the same field, you can provide a [aggregation operation](https://vega.github.io/vega-lite/docs/aggregate.html#supported-aggregation-operations) here to specify the particular aggregated field that you want to customize. |


[//]: # (TODO(zening): tooltip fields order: can we recommend which fields should go first and which ones should go later? I feel that the fields that are most frequently changing as the mouse moves, as well as the field that's encoded with color should go first.)
