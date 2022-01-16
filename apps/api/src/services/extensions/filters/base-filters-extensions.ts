import { OrderFilter, PaginationFilter } from '@boilerplate/shared';
import { EntityFieldsNames } from 'typeorm/common/EntityFieldsNames';

export type OrderType<Entity> = {
  [P in EntityFieldsNames<Entity>]?: "ASC" | "DESC" | 1 | -1
};

export function getOrderOptionsFromFilter<T>(filter: OrderFilter<T>): OrderType<T> {
  return filter.orderedBy?.reduce((acc, v) => ({
    ...acc,
    [v.field]: v.isReversed ? 'DESC' : 'ASC'
  }), {});
}

export function getLimitOptionFromFilter(filter: PaginationFilter, defaultSize: number | null = 10): number | null {
  return filter.pageSize || defaultSize || null;
}

export function getOffsetOptionFromFilter(filter: PaginationFilter): number | null {
  if (filter.page)
    return getLimitOptionFromFilter(filter) * (filter.page - 1);
  else
    return null;
}
