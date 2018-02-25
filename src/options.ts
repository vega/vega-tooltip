import {ScenegraphData} from './options';
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
}

export type FieldCallback = (item: ScenegraphData) => string;
export type FormatCallback = (value: ScenegraphPrimitive) => string;
export interface FieldOption {
  field?: string | FieldCallback;
  title?: string | FieldCallback;
  formatType?: 'number' | 'time' | 'string';
  format?: string | FormatCallback;
  aggregate?: string;
  bin?: boolean;
}

export interface SupplementedFieldOption extends FieldOption {
  removeOriginalTemporalField?: string;
  bin?: boolean;
}

export type ScenegraphPrimitive = string | number | Date;
export interface ScenegraphData {
  [key: string]: ScenegraphPrimitive | ScenegraphData;
}

export type TooltipData = {title: string, value: string | number};

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
