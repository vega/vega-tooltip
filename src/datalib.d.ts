declare module 'datalib/src' {
  export function format
  export function type()

  export function keys(a): Array<string>;
  export function extend(a, b, ...rest);
  export function duplicate<T>(a: T): T;
  export function isArray(a: any | any[]): a is any[];
  export function vals(a);
  export function truncate(a: string, length: number): string;
  export function toMap(a);
  export function isObject(a): a is any;
  export function isString(a): a is string;
  export function isNumber(a): a is number;
  export function isBoolean(a): a is boolean;
}

