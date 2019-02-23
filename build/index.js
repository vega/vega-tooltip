import { Handler } from './Handler';
export * from './defaults';
export * from './formatValue';
export * from './position';
export * from './Handler';
/**
 * Create a tooltip handler and register it with the provided view.
 *
 * @param view The Vega view.
 * @param opt Tooltip options.
 */
export default function (view, opt) {
    const handler = new Handler(opt);
    view.tooltip(handler.call).run();
    return handler;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUVwQyxjQUFjLFlBQVksQ0FBQztBQUMzQixjQUFjLGVBQWUsQ0FBQztBQUM5QixjQUFjLFlBQVksQ0FBQztBQUMzQixjQUFjLFdBQVcsQ0FBQztBQUUxQjs7Ozs7R0FLRztBQUNILE1BQU0sQ0FBQyxPQUFPLFdBQVUsSUFBVSxFQUFFLEdBQXNCO0lBQ3hELE1BQU0sT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRWpDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBRWpDLE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUMifQ==