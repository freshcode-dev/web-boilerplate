import { TransformFnParams } from 'class-transformer';
import { transformStringToBoolean } from './string-to-boolean';

export const transformStringToBooleanNullable = (params: Pick<TransformFnParams, 'value'>): boolean | null =>
	params.value ? transformStringToBoolean(params) : null;
