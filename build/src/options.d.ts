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
export declare type TooltipData = {
    title: string;
    value: string | number;
};
export declare type Scenegraph = {
    datum: {
        _facetID: number;
        _id: number;
    };
    mark: {
        marktype: string;
        items: object;
        name: string;
    };
};
export declare type VgView = any;
export declare const DELAY = 100;
