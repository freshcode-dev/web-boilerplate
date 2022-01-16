import { OrderParamPair } from './order-param-pair';

export interface OrderFilter<T> {
	orderedBy?: OrderParamPair<T>[] | null;
}
