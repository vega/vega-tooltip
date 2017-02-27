import {FormatSpecifier} from 'd3-format'
import {AggregateOp} from 'vega-lite/src/aggregate'
export interface Option {
  showAllFields: boolean,
  fields: [{
    field: string,
    title: string,
    formatType: 'number' | 'time' | 'string'
    format: FormatSpecifier,
    aggregate: AggregateOp
  }],
  delay: number,
  onAppear: (event: Event, item: any) => void,
  onMove: (event: Event, item: any) => void,
  onDisappear: (event: Event, item: any) => void,
  colorTheme: 'light' | 'dark'
}
