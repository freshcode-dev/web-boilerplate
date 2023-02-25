import { NonFunctionPropertyNames, OrderFilter, PaginationFilter } from '@boilerplate/shared';

export type OrderType<Entity> = {
  [P in NonFunctionPropertyNames<Entity>]?: "ASC" | "DESC" | 1 | -1
};

export function getOrderOptionsFromFilter<T>(filter: OrderFilter<T>): OrderType<T> {
  return filter.orderedBy?.reduce((acc, v) => ({
    ...acc,
    [v.field]: v.isReversed ? 'DESC' : 'ASC'
  }), {}) as OrderType<T>;
}

export function getLimitOptionFromFilter(filter: PaginationFilter, defaultSize: number | null = 10): number | null {
  return filter.pageSize || defaultSize || null;
}

export function getOffsetOptionFromFilter(filter: PaginationFilter): number | null {
  if (filter.page) {
    const limitOption = getLimitOptionFromFilter(filter);

    if (!limitOption) {
      return null;
    }

    return limitOption * (filter.page - 1);
  }

  return null;
}
