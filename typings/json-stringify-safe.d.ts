declare module 'json-stringify-safe' {
  const stringify: (object: any, serializer?: any, indent?: number, decycler?: any) => string;
  export = stringify;
}
