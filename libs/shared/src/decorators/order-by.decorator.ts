import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderedBy } from '../models/filters/order-by.filter';

interface OrderedByClass<T> {
	new(): OrderedBy<T>;
}

export const OrderBy = <T>(orderClass: OrderedByClass<T>): PropertyDecorator =>
	(target, propertyKey) => {
		ValidateNested({ each: true })(target, propertyKey);
		Type(() => orderClass)(target, propertyKey);
		IsOptional()(target, propertyKey);
	};
