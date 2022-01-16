import { NonFunctionPropertyNames } from '../../utils/utility-types';

export interface OrderParamPair<T> {
  field: NonFunctionPropertyNames<Required<T>>;
  isReversed?: boolean;
}
