import { StyledComponent } from '@emotion/styled';
import { styled, Theme } from '@mui/material/styles';
import { VariantType } from 'notistack';
import { PropsWithChildren } from 'react';

interface CoreToastTextProps {
	variant: VariantType;
}

const getTextColor = (theme: Theme, variant: VariantType) => {
	switch (variant) {
		case 'info':
			return theme.colors.black;
		default:
			return theme.colors.white;
	}
};

export const CoreToastText: StyledComponent<PropsWithChildren<CoreToastTextProps>> = styled('div')<CoreToastTextProps>(
	({ theme, variant }) => ({
		flex: 1,
		color: getTextColor(theme, variant),
	})
);
