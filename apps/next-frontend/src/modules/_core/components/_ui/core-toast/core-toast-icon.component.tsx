import { StyledComponent } from '@emotion/styled';
import { Theme, styled } from '@mui/material/styles';
import { VariantType } from 'notistack';
import { CSSProperties, PropsWithChildren } from 'react';

interface CoreToastIconProps {
	variant: VariantType;
}

const getBgColor: (theme: Theme, variant: VariantType) => CSSProperties['color'] = (
	theme: Theme,
	variant: VariantType
) => {
	switch (variant) {
		case 'info':
			return theme.colors.black;
		default:
			return theme.colors.white;
	}
};

export const getColor: (theme: Theme, variant: VariantType) => CSSProperties['color'] = (
	theme: Theme,
	variant: VariantType
) => {
	switch (variant) {
		case 'info':
			return theme.colors.white;
		case 'error':
			return theme.colors.red;
		case 'success':
			return theme.colors.green;
		case 'default':
		default:
			return theme.colors.black;
	}
};

export const CoreToastIcon: StyledComponent<PropsWithChildren<CoreToastIconProps>> = styled('div')<CoreToastIconProps>(
	({ theme, variant }) => ({
		width: 40,
		height: 40,
		marginRight: 16,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		color: getColor(theme, variant),
		backgroundColor: getBgColor(theme, variant),
		borderRadius: 20})
);
