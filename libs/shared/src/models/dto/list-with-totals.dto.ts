export class ListWithTotals<T> {
	list: T[];

	total: number | null;
	offset?: number;
	limit?: number;
}
