import { FC } from 'react';
import { styled } from '@mui/material/styles';

export const CoreTableOverflowWrapper: FC<
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = styled('div')(() => ({
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	minWidth: '100%',
}));
