import { ListWithTotals } from '@boilerplate/shared';

export const hasMore = (data?: ListWithTotals<unknown>): boolean => {
	const total = data?.total ?? 0;
	const loadedCount = data?.list.length ?? 0;

	return loadedCount < total;
};
