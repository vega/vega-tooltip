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
}

export interface FieldOption {
  field?: string;
  title?: string;
  formatType?: 'number' | 'time' | 'string';
  format?: string;
  aggregate?: string;
  bin?: boolean;
}
