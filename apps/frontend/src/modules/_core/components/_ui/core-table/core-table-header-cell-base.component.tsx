import React, { FC, PropsWithChildren } from 'react';
import { styled } from '@mui/material/styles';

interface CoreTableHeaderCellProps extends React.HTMLAttributes<HTMLDivElement> {
	sortable?: boolean;
	size: number;
	flex?: number;
}

type Props = PropsWithChildren<CoreTableHeaderCellProps>;

const propNames = ['sortable', 'size', 'flex'];

export const CoreTableHeaderCellBase: FC<Props> = styled('div', {
	shouldForwardProp: (name: string) => !propNames.includes(name),
})<Props>(({ theme, size, flex }) => ({
	...theme.typography.label,
	color: theme.colors.gray,
	padding: `4px 6px`,
	backgroundColor: theme.colors.white,
	height: 37,
	width: !flex ? size : undefined,
	minWidth: flex ? size : undefined,
	flex: flex ? `${flex} 1 auto` : '0 0 auto',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	display: 'flex',
	alignItems: 'center',
}));
