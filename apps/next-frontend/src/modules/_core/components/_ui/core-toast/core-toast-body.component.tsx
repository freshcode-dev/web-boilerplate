/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyledComponent } from '@emotion/styled';
import { styled, SxProps, Theme } from '@mui/material/styles';
import { VariantType } from 'notistack';

interface WithAnyChildren {
	children: any;
}

interface CoreToastBodyProps extends WithAnyChildren {
	variant: VariantType;
	sx?: SxProps<Theme>;
}

const getBgColor = (theme: Theme, variant: VariantType) => {
	switch (variant) {
		case 'error':
			return  theme.colors.red;
		case 'info':
			return theme.colors.blueTransparentLight;
		case 'success':
			return theme.colors.green;
		case 'default':
		default:
			return theme.colors.black;
	}
};

export const CoreToastBody: StyledComponent<CoreToastBodyProps> = styled('div')<CoreToastBodyProps>(
	({ theme, variant }) => ({
		alignItems: 'center',
		position: 'relative',
		padding: '24px 18px 24px 24px',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: getBgColor(theme, variant),
		width: '100%',
		display: 'flex',
		boxShadow: `0px 4px 24px ${theme.colors.blueTransparent}`,
		border: variant === 'info' ? `1px solid ${theme.colors.black}` : undefined,
		[theme.breakpoints.down('sm')]: {
			maxWidth: '100%',
			pr: 3,
		},
	})
);

export const CoreToastBodyContent: StyledComponent<WithAnyChildren> = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	flex: 1,
}));
