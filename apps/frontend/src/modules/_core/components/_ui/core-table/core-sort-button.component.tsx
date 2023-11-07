import { FC } from 'react';
import { styled } from '@mui/material/styles';
import { ButtonBase, ButtonBaseProps } from '@mui/material';

interface CoreSortButtonProps extends ButtonBaseProps {
	sorted?: boolean;
}

export const CoreSortButton: FC<CoreSortButtonProps> = styled(ButtonBase, {
	shouldForwardProp: (name) => name !== 'sorted',
})<CoreSortButtonProps>(({ theme, sorted }) => ({
	...theme.typography.label,
	color: !sorted ? theme.colors.gray : theme.colors.blue,
	borderRadius: theme.shape.borderRadius / 2,
	padding: 4,
	border: '2px solid transparent',

	'&.Mui-focusVisible': {
		border: `2px solid ${theme.colors.blue}`,
	},
	'& .svg-sort-icon': {
		marginLeft: 8,
		minWidth: 16,
	},
}));
