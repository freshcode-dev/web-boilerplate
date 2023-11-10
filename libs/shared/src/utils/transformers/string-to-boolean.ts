import { TransformFnParams } from 'class-transformer';

export const transformStringToBoolean = ({ value }: Pick<TransformFnParams, 'value'>): boolean => value === 'true';
