import * as tslib_1 from "tslib";
import { createDefaultStyle, DEFAULT_OPTIONS, escapeHTML } from './defaults';
import { formatValue } from './formatValue';
import { calculatePosition } from './position';
/**
 * The tooltip handler class.
 */
var Handler = /** @class */ (function () {
    /**
     * Create the tooltip handler and initialize the element and style.
     *
     * @param options Tooltip Options
     */
    function Handler(options) {
        this.options = tslib_1.__assign({}, DEFAULT_OPTIONS, options);
        var elementId = this.options.id;
        // bind this to call
        this.call = this.tooltip_handler.bind(this);
        // prepend a default stylesheet for tooltips to the head
        if (!this.options.disableDefaultStyle && !document.getElementById(this.options.styleId)) {
            var style = document.createElement('style');
            style.setAttribute('id', this.options.styleId);
            style.innerHTML = createDefaultStyle(elementId);
            if (document.head.childNodes.length > 0) {
                document.head.insertBefore(style, document.head.childNodes[0]);
            }
            else {
                document.head.appendChild(style);
            }
        }
        // append a div element that we use as a tooltip unless it already exists
        this.el = document.getElementById(elementId);
        if (!this.el) {
            this.el = document.createElement('div');
            this.el.setAttribute('id', elementId);
            this.el.classList.add('vg-tooltip');
            document.body.appendChild(this.el);
        }
    }
    /**
     * The tooltip handler function.
     */
    Handler.prototype.tooltip_handler = function (handler, event, item, value) {
        // console.log(handler, event, item, value);
        // hide tooltip for null, undefined, or empty string values
        if (value == null || value === '') {
            this.el.classList.remove('visible', this.options.theme + "-theme");
            return;
        }
        // set the tooltip content
        this.el.innerHTML = formatValue(value, escapeHTML, this.options.maxDepth);
        // make the tooltip visible
        this.el.classList.add('visible', this.options.theme + "-theme");
        var _a = calculatePosition(event, this.el.getBoundingClientRect(), this.options.offsetX, this.options.offsetY), x = _a.x, y = _a.y;
        this.el.setAttribute('style', "top: " + y + "px; left: " + x + "px");
    };
    return Handler;
}());
export { Handler };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9IYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxFQUFFLFVBQVUsRUFBVyxNQUFNLFlBQVksQ0FBQztBQUN0RixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzVDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUUvQzs7R0FFRztBQUNIO0lBZ0JFOzs7O09BSUc7SUFDSCxpQkFBWSxPQUEwQjtRQUNwQyxJQUFJLENBQUMsT0FBTyx3QkFBUSxlQUFlLEVBQUssT0FBTyxDQUFFLENBQUM7UUFDbEQsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFFbEMsb0JBQW9CO1FBQ3BCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFNUMsd0RBQXdEO1FBQ3hELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3ZGLElBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDOUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMvQyxLQUFLLENBQUMsU0FBUyxHQUFHLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRWhELElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDdkMsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDaEU7aUJBQU07Z0JBQ0wsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDbEM7U0FDRjtRQUVELHlFQUF5RTtRQUN6RSxJQUFJLENBQUMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFFLENBQUM7UUFDOUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUU7WUFDWixJQUFJLENBQUMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUVwQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDcEM7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDSyxpQ0FBZSxHQUF2QixVQUF3QixPQUFZLEVBQUUsS0FBaUIsRUFBRSxJQUFTLEVBQUUsS0FBVTtRQUM1RSw0Q0FBNEM7UUFFNUMsMkRBQTJEO1FBQzNELElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLEtBQUssRUFBRSxFQUFFO1lBQ2pDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFdBQVEsQ0FBQyxDQUFDO1lBQ25FLE9BQU87U0FDUjtRQUVELDBCQUEwQjtRQUMxQixJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTFFLDJCQUEyQjtRQUMzQixJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxXQUFRLENBQUMsQ0FBQztRQUUxRCxJQUFBLDBHQUtMLEVBTE8sUUFBQyxFQUFFLFFBQUMsQ0FLVjtRQUVGLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxVQUFRLENBQUMsa0JBQWEsQ0FBQyxPQUFJLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBQ0gsY0FBQztBQUFELENBQUMsQUEvRUQsSUErRUMifQ==