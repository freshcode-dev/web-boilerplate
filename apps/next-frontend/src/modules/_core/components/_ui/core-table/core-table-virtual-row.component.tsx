import React from "react";
import { CoreTableCell } from "./core-table-cell.component";
import { Row, RowData } from "@tanstack/react-table";
import { Box } from "@mui/material";
import { VirtualItem } from "@tanstack/react-virtual";
import { CoreTableCellWithTooltip } from "./core-table-cell-with-tooltip.component";

interface CoreTableVirtualRowProps<TData extends RowData> {
	virtualRow: VirtualItem<Element>;
	row?: Row<TData>;
	measureElement(node: (Element | null)): void;
}

export interface Meta {
	flex?: number;
	useCustomOverflowContainer?: boolean;
	heightAuto?: boolean;
}

export const CoreTableVirtualRow = <TData extends RowData>(props: CoreTableVirtualRowProps<TData>) => {
	const { virtualRow, row, measureElement } = props;

	return (
		<Box
			role="row"
			data-index={virtualRow.index}
			ref={measureElement}
			sx={{
				display: 'flex',
				position: 'absolute',
				top: 0,
				minWidth: '100%',
				borderBottom: theme => `1px solid ${theme.colors.divider}`,
				transform: `translateY(${virtualRow.start}px)`,
				padding: '0 12px'
			}}
		>
			{row?.getVisibleCells().map(cell => (
					<CoreTableCellWithTooltip
						key={cell.id}
						cell={cell}
					/>
				))}
			{!row && <CoreTableCell size="100%" />}
		</Box>
	);
};
