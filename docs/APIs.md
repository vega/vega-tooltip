# Constructors

The `vegaTooltip` module exports the following properties:

* [`default`](#tooltip)
* [`Handler`](#handler)
* [`DEFAULT_OPTIONS`](#options)
* [`escapeHTML`](#sanitize)

## [vegaTooltip](#tooltip)

A convenience wrapper to initialize [a tooltip handler](#handler) and registering it with the view.

`vegaTooltip.default(view [, options])`

| Parameter       | Type           | Description     |
| :-------------- |:--------------:| :-------------- |
| `view`          | [Vega View](vega.github.io/vega/docs/api/view) | The visualization view. |
| `options`       | [Options](#options) | Options to customize the tooltip. See [options](#options) for details. |

__Returns:__ The tooltip [`handler`](#handler)

## [Handler](#handler)

A tooltip handler class. The constructor of this class takes only one argument `options`.

`new vegaTooltip.Handler([options])`

| Parameter       | Type           | Description     |
| :-------------- |:--------------:| :-------------- |
| `options`       | [Options](#options) | Options to customize the tooltip. See [options](#options) for details. |

When a tooltip is created, we automatically create a default stylesheet and attach it to the head. We also create a div element in the body that we the use for the tooltip.

The tooltip handler has the following methods.

| Method          | Parameter(s)   | Description     |
| :-------------- |:--------------:| :-------------- |
| `call`          | `handler`, `event`, `item`, `value` | The tooltip handler function. |

Unless you use [the convenience method from above](#tooltip), you have to register the handler with the Vega view.

```js
var tooltip = new vegaTooltip.Handler(options);

var runtime = vega.parse(spec);
var view = new vega.View(runtime)
  .initialize(document.getElementById("vis"))
  .tooltip(tooltip.call)
  .run();
```

## [Options](#options)

`options` can customize the tooltip. All of its properties are optional.

| Property        | Type           | Description     |
| :-------------- |:--------------:| :-------------- |
| `offsetX`       | Number         | The horizontal offset. |
| `offsetY`       | Number         | The vertical offset. |
| `id`            | String         | The ID of the tooltip element. The default name is `vg-tooltip-element`. |
| `styleId`       | String         | The ID of the stylesheet. The default name is `vega-tooltip-style`. |
| `theme`         | String         | A color theme. <br>__Supported values:__ `"light"`, `"dark"`, or a custom name. <br>__Default value:__ `"light"` <br>To customize your own theme, create CSS for the `[THEME]-theme` class. |
| `disableDefaultStyle` | Boolean  | Disable the default style completely. |
| `sanitize`      | Function       | Function to convert value to string, and sanitize the HTML. |
| `maxDepth`      | Number         | The maximum recursion depth when printing objects in the tooltip. |
| `formatTooltip` | Function       | Function to specify custom HTML inside tooltip element. It is highly recommended to `sanitize` any data from `value` before returning an HTML string. |
| `baseURL`       | String         | The base URL to use for resolving relative URLs for images. |


The default values are:

```js
var DEFAULT_OPTIONS =
{
  offsetX: 10,
  offsetY: 10,
  id: 'vg-tooltip-element',
  styleId: 'vega-tooltip-style',
  theme: 'light',
  disableDefaultStyle: false,
  sanitize: (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;'),
  formatTooltip: vegaTooltip.formatValue,
  baseURL: ''
};
```

## [Sanitize](#sanitize)

Vega Tooltip escapes HTML content from the Vega spec before displaying it in the tooltip. This prevents problems with users executing unknown code in their browser.

If you want to allow custom formatting, you may provide a custom sanitization function. For example, if you want to support Markdown, you could use [simple-markdown](https://github.com/Khan/simple-markdown).

```js
function markdown(md) {
  var text  String(md);
  var parsed = SimpleMarkdown.defaultBlockParse(text);
  var html = SimpleMarkdown.defaultHtmlOutput(parsed);
  return vegaTooltip.escapeHTML(html);
}

var tooltip = new vegaTooltip.Handler({
  sanitize: markdown
});
```
