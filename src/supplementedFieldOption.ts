import {FieldOption} from './options';
export interface SupplementedFieldOption extends FieldOption {
  removeOriginalTemporalField?: string;
  bin?: boolean;
}
