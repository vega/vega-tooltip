import { ScenegraphData } from './options';
export declare type SortCallback = (datum: TooltipData) => number;
export interface Option {
    showAllFields?: boolean;
    fields?: FieldOption[];
    delay?: number;
    offset?: {
        x: number;
        y: number;
    };
    onAppear?(event: Event, item: object): void;
    onMove?(event: Event, item: object): void;
    onDisappear?(event: Event, item: object): void;
    colorTheme?: 'light' | 'dark';
    isComposition?: boolean;
    sort?: 'title' | 'value' | SortCallback;
}
export declare type TitleAccessor = (item: ScenegraphData) => string;
export declare type FormatCallback = (value: ScenegraphPrimitive) => string;
export declare type ValueAccessor = (item: ScenegraphData) => ScenegraphPrimitive;
export declare type RowRenderer = (title: string, value: string | number) => Element;
export interface FieldOption {
    field?: string;
    title?: string | TitleAccessor;
    formatType?: 'number' | 'time' | 'string';
    format?: string | FormatCallback;
    valueAccessor?: ValueAccessor;
    aggregate?: string;
    bin?: boolean;
    render?: RowRenderer;
}
export interface SupplementedFieldOption extends FieldOption {
    removeOriginalTemporalField?: string;
    bin?: boolean;
}
export declare type ScenegraphPrimitive = string | number | Date;
export interface ScenegraphData {
    [key: string]: ScenegraphPrimitive | ScenegraphData;
}
export declare type TooltipData = {
    title: string;
    value: string | number;
    rawValue: string | number | Date;
    render?: RowRenderer;
};
export declare type Scenegraph = {
    datum: ScenegraphData;
    mark: {
        marktype: string;
        items: object;
        name: string;
    };
};
export declare type TemporaryFieldOption = {
    [key: string]: FieldOption;
};
export declare type VgView = any;
export declare const DELAY = 100;
