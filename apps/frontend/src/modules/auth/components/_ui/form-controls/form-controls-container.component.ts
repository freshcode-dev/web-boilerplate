import { styled } from '@mui/material/styles';
import { StyledComponent } from '@emotion/styled';
import { HTMLAttributes } from 'react';

export const FormControlsContainer: StyledComponent<HTMLAttributes<HTMLDivElement>> = styled('div')(({ theme }) => ({
	display: 'flex',
	justifyContent: 'center',
	paddingTop: theme.spacing(4),
	paddingBottom: theme.spacing(4),

	[theme.breakpoints.down('sm')]: {
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(2),
	}
}));

