import { Ref } from 'react';
import { SortingState, Updater } from '@tanstack/react-table';

export interface TableListQueryResponse<TData, TFilter = unknown> {
	loading: boolean;
	data: TData[];
	sorting?: SortingState;
	hasMore?: boolean;
	scrollRef?: Ref<HTMLDivElement>;
	hasFilters?: boolean;
	fetchMore?(count: number): void;
	reset?(): void;
	resetFilterAndRefetch?(filter?: Partial<TFilter>): void;
	onSortingChange?(updater: Updater<SortingState>): void;
}

