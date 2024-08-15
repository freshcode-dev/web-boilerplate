import { FC } from 'react';
import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface CoreHeaderContainerProps {
	smallPx?: boolean;
}

export const CoreHeaderContainer: FC<BoxProps & CoreHeaderContainerProps> = styled(Box, {
	shouldForwardProp: (name) => name !== 'smallPx',
})<CoreHeaderContainerProps>(({ theme, smallPx }) => ({
	padding: `0 ${theme.spacing(!smallPx ? 3 : 2)}`,
	height: 64,
	display: 'flex',
	alignItems: 'center',
	columnGap: '8px',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: theme.colors.white,
}));
