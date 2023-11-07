import React from "react";
import { HeaderGroup, RowData, flexRender } from "@tanstack/react-table";
import { Box } from "@mui/material";
import CoreTableHeaderCell from "./core-table-header-cell.component";

interface CoreTableHeaderProps<TData extends RowData> {
	headerGroups: HeaderGroup<TData>[];
}

const CoreTableHeader = <TData extends RowData>(props: CoreTableHeaderProps<TData>) => {
	const { headerGroups } = props;

  return (
		<Box
			role="rowgroup"
			sx={{
				display: 'inline-flex',
				minWidth: '100%',
				flexDirection: 'column',
				position: 'sticky',
				top: 0,
				backgroundColor: theme => theme.colors.white,
				zIndex: 2,
				padding: '0 12px',
				borderBottom: theme => `1px solid ${theme.colors.divider}`,
			}}
		>
			{headerGroups.map(({ headers, id }) => (
				<Box role="row" key={id} sx={{ display: 'flex' }}>
					{headers.map(header => (
						<CoreTableHeaderCell
							key={header.id}
							size={header.getSize()}
							meta={header.column.columnDef.meta}
							sortable={header.column.getCanSort()}
							order={header.column.getIsSorted()}
							onToggle={header.column.getToggleSortingHandler()}
						>
							{header.isPlaceholder
								? null
								: flexRender(header.column.columnDef.header, header.getContext())
							}
						</CoreTableHeaderCell>
					))}
				</Box>
			))}
		</Box>
	);
};

export default CoreTableHeader;
