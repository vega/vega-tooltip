import {FieldOption} from './options'
export interface supplementedFieldOption extends FieldOption {
  removeOriginalTemporalField?: string,
  bin?: boolean
}
