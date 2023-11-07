import React, { FC, ReactNode } from 'react';
import { CoreTableHeaderCellBase } from './core-table-header-cell-base.component';
import { SortDirection } from '@tanstack/react-table';
import { Sort, SortDesc, SortAsc } from '../../../constants/icons.constants';
import { CoreSortButton } from './core-sort-button.component';
import { Meta } from './core-table-virtual-row.component';
import { Box } from '@mui/material';

interface CoreTableHeaderCellProps {
	children: ReactNode;
	sortable: boolean;
	size: number;
	meta?: Meta;
	order: false | SortDirection;
	onToggle?(event: unknown): void;
}

const CoreTableHeaderCell: FC<CoreTableHeaderCellProps> = (props) => {
	const { children, sortable, order, onToggle, size, meta } = props;

	return (
		<CoreTableHeaderCellBase sortable={sortable} role="columnheader" size={size} flex={meta?.flex}>
			{sortable ? (
				<CoreSortButton onClick={onToggle} sorted={order !== false} sx={{ maxWidth: '100%' }}>
					<Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{children}</Box>
					{order === false && <Sort className="svg-sort-icon" />}
					{order === 'asc' && <SortAsc className="svg-sort-icon" />}
					{order === 'desc' && <SortDesc className="svg-sort-icon" />}
				</CoreSortButton>
			) : typeof children === 'string' ? (
				<Box sx={{ maxWidth: '100%', p: '6px', fontSize: '0.8rem', cursor: 'default' }}>
					<Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{children}</Box>
				</Box>
			) : (
				children
			)}
		</CoreTableHeaderCellBase>
	);
};

export default CoreTableHeaderCell;
