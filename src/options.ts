import {ScenegraphData} from './options';

export type SortCallback = (datum: TooltipData) => number;
export interface Option {
  showAllFields?: boolean;
  fields?: FieldOption[];
  delay?: number;
  offset?: {
    x: number,
    y: number
  };
  onAppear?(event: Event, item: object): void;
  onMove?(event: Event, item: object): void;
  onDisappear?(event: Event, item: object): void;
  colorTheme?: 'light' | 'dark';
  isComposition?: boolean;
  sort?: 'title' | 'value' | SortCallback;
}

export interface FieldOption {
  field?: string;
  title?: string;
  formatType?: 'number' | 'time' | 'string';
  format?: string;
  aggregate?: string;
  bin?: boolean;
}

export interface SupplementedFieldOption extends FieldOption {
  removeOriginalTemporalField?: string;
  bin?: boolean;
}

export interface ScenegraphData {
  [key: string]: string | number | Date | ScenegraphData;
}

export type TooltipData = {
  title: string,
  value: string | number,
  rawValue: string | number | Date
};

export type Scenegraph = {
  datum: ScenegraphData,
  mark: {
    marktype: string,
    items: object,
    name: string
  }
};

export type TemporaryFieldOption = {
  [key: string]: FieldOption
};

export type VgView = any;

export const DELAY = 100;
