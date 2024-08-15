import { FC } from 'react';
import { styled } from '@mui/material/styles';

interface CoreTableCellProps extends React.HTMLAttributes<HTMLDivElement> {
	flex?: number;
	heightAuto?: boolean;
	size: number | string;
}

export const CoreTableCell: FC<CoreTableCellProps> = styled('div', {
	shouldForwardProp: (name) => name !== 'flex' && name !== 'size' && name !== 'heightAuto',
})<CoreTableCellProps>(({ theme, flex, size, heightAuto }) => ({
	...theme.typography.label,
	padding: `${!heightAuto ? '8px' : '0'} 12px`,
	display: 'flex',
	alignItems: 'center',
	width: size,
	flex: flex ? `${flex} 1 auto` : '0 0 auto',
	textAlign: 'left',
	whiteSpace: 'nowrap',
	height: !heightAuto ? 48 : 'auto',
}));
