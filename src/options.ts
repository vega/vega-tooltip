import {FormatSpecifier} from 'd3-format';
import {AggregateOp} from 'vega-lite/src/aggregate';
import {FieldDef} from 'vega-lite/src/fielddef';
export interface Option {
  showAllFields?: boolean,
  fields?: Field[],
  delay?: number,
  onAppear?(event: Event, item: any): void,
  onMove?(event: Event, item: any): void,
  onDisappear?(event: Event, item: any): void,
  colorTheme?: 'light' | 'dark'
}

export interface Field extends FieldDef {
    formatType?: 'number' | 'time' | 'string'
    format?: FormatSpecifier
}
