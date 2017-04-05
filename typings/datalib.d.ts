declare module 'datalib' {
  export function type(o: any): string

  export namespace format {
    export function time(format: any): (s: string) => any
    export function number(format: any): (s: string) => any

    export namespace auto {
      export function time(): (s: string) => any
      export function number(): (s: string) => any
    }
  }
}
