import React, { ForwardedRef, ReactNode, useCallback, forwardRef, Ref } from "react";
import { Box } from "@mui/material";
import { HeaderGroup, RowData, RowModel } from '@tanstack/react-table';
import { CoreTableBody } from "./core-table-body.component";
import { useScrollFetcher } from "../../../hooks/use-scroll-fetcher.hook";
import { CoreTableHeader } from "./core-table-header.component";
import { CoreLoadingWall } from "../core-loading-wall";

interface CoreTableProps<TData extends RowData> {
	headerGroups: HeaderGroup<TData>[];
	rowModel: RowModel<TData>;
	px?: number;
	loading?: boolean;
	threshold?: number;
	hasMore?: boolean;
	emptyListComponent?: ReactNode;
	fetchMore?(count: number): void;
}

const CoreTableBase = <TData extends RowData>(
	props: CoreTableProps<TData>,
	ref: ForwardedRef<HTMLDivElement>
) => {
	const {
		headerGroups,
		rowModel,
		px = 3,
		fetchMore,
		hasMore,
		loading,
		threshold = 100,
		emptyListComponent
	} = props;

	const itemsCount = rowModel.rows.length;
	const showEmptyComponent = !loading && itemsCount === 0;
	const showWallLoader = loading && itemsCount === 0;

	const { containerRef, onScroll } = useScrollFetcher({
		threshold,
		fetchMore,
		itemsCount
	});

	const shouldAttachScrollListener = hasMore && !loading;

	const getRef = useCallback((instance: HTMLDivElement) => {
		containerRef.current = instance;

		if (ref) {
			if (typeof ref === 'function') {
				ref(instance);
			} else {
				ref.current = instance;
			}
		}
	}, [containerRef, ref]);

	return (
		<Box
			role="table"
			onScroll={shouldAttachScrollListener ? onScroll : undefined}
			sx={{ px, overflow: 'auto', flex: 1, position: 'relative' }}
			ref={getRef}
		>
			<CoreTableHeader headerGroups={headerGroups} />
			{!showEmptyComponent && (
				<CoreTableBody
					rowModel={rowModel}
					containerRef={containerRef}
				/>
			)}
			{showEmptyComponent && emptyListComponent}
			{showWallLoader && <CoreLoadingWall />}
		</Box>
	);
};

export const CoreTable = forwardRef(CoreTableBase) as <T>(
	props: CoreTableProps<T> & { ref?: Ref<HTMLDivElement>}
) => ReturnType<typeof CoreTableBase>;
