import React, { MutableRefObject } from "react";
import { RowData, RowModel } from "@tanstack/react-table";
import { Box } from "@mui/material";
import { useVirtualizer } from '@tanstack/react-virtual';
import { CoreTableVirtualRow } from "./core-table-virtual-row.component";

interface CoreTableBodyProps<TData extends RowData> {
	rowModel: RowModel<TData>;
	containerRef: MutableRefObject<HTMLDivElement | null>;
}

export const CoreTableBody = <TData extends RowData>(props: CoreTableBodyProps<TData>) => {
	const { rowModel, containerRef } = props;

	const { rows } = rowModel;

	const { getTotalSize, getVirtualItems, measureElement } = useVirtualizer({
		count: rows.length,
		getScrollElement: () => containerRef.current,
		estimateSize: () => 49,
		measureElement: element => element?.getBoundingClientRect().height,
	});

	const virtualRows = getVirtualItems();
	const totalSize = getTotalSize();

  return (
		<Box
			role="rowgroup"
			sx={{
				height: totalSize,
				position: 'relative'
			}}
		>
			{virtualRows.map(virtualRow => {
				const row = rows[virtualRow.index];

				return (
					<CoreTableVirtualRow
						key={virtualRow.key}
						measureElement={measureElement}
						virtualRow={virtualRow}
						row={row}
					/>
				);
			})}
		</Box>
	);
};
