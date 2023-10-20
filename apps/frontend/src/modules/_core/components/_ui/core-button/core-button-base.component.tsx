import { styled } from "@mui/material/styles";
import { ButtonBase, ButtonBaseProps, Theme } from "@mui/material";
import { StyledComponent } from "@emotion/styled";

export type CoreButtonVariant = 'primary' | 'secondary' | 'danger';

export interface CoreButtonBaseProps extends ButtonBaseProps {
	variant?: CoreButtonVariant;
}

const getTextColor = (variant: CoreButtonVariant, theme: Theme) => {
	switch (variant) {
		case "danger":
			return theme.colors.red;
		case "primary":
			return theme.colors.orange;
		case "secondary":
			return theme.colors.darkGray;
	}
};

const getFocusColor = (variant: CoreButtonVariant, theme: Theme) => {
	switch (variant) {
		case "danger":
			return theme.colors.redPressed;
		case "primary":
			return '#E05920';
		case "secondary":
			return theme.colors.black;
	}
};

export const CoreButtonBase: StyledComponent<CoreButtonBaseProps> = styled(ButtonBase)<CoreButtonBaseProps>(({ theme, variant = 'primary' }) => {
	const { typography, colors, transitions } = theme;

	const textColor = getTextColor(variant, theme);
	const focusColor = getFocusColor(variant, theme);

	return {
		...typography.button,
		textTransform: 'none',
		lineHeight: '24px',
		color: textColor,
		border: `1px solid ${textColor}`,
		borderRadius: '100px',
		padding: '11px 24px',
		transition: transitions.create(['background-color', 'color', 'border-color'], {
			duration: transitions.duration.short
		}),
		'&:hover, &.Mui-focusVisible, &.core-button-loading': {
			color: colors.white,
			backgroundColor: textColor
		},
		'&:active': {
			color: colors.white,
			backgroundColor: focusColor,
			borderColor: focusColor
		},
		'&.Mui-focusVisible': {
			boxShadow: `inset 0 0 0 1px ${focusColor}`,
			borderColor: focusColor
		},
		'&:disabled:not(.core-button-loading)': {
			color: colors.blueTransparent,
			borderColor: colors.blueTransparent
		}
	};
});
 export default CoreButtonBase;
