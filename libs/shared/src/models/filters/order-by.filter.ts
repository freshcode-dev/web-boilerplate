import { OrderParamPair } from '../../interfaces/filters/order-param-pair';
import type { NonFunctionPropertyNames } from '../../utils/utility-types';
import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OrderedBy<T> implements OrderParamPair<T> {
	@IsNotEmpty()
	@IsString()
	field: NonFunctionPropertyNames<Required<T>>;

	@IsBoolean()
	@IsOptional()
	isReversed = false;

	@IsIn(['LAST', 'FIRST'])
	@IsOptional()
	nulls?: 'LAST' | 'FIRST';
}
