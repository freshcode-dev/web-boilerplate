import { FC } from "react";
import { styled } from "@mui/material/styles";
import { ButtonBase, ButtonBaseProps } from "@mui/material";

export interface CoreActionButtonProps extends ButtonBaseProps {
	variant?: 'danger' | 'primary';
}

export const CoreActionButton: FC<CoreActionButtonProps> = styled(ButtonBase)<CoreActionButtonProps>(({ theme, variant = 'primary' }) => {
	const { transitions, colors, shape } = theme;

	const isPrimary = variant === 'primary';

	const bgColor = isPrimary ? colors.blue : colors.red;
	const activeColor = isPrimary ? colors.bluePressed : colors.redPressed;

	return {
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.blueTransparentLight,
		borderRadius: shape.borderRadius,
		color: colors.blue,
		border: '2px solid transparent',
		transition: transitions.create(['background-color', 'color', 'border-color'], {
			duration: transitions.duration.short
		}),

		'&:hover, &.Mui-focusVisible': {
			color: colors.white,
			backgroundColor: bgColor
		},

		'&:active, &.active-button': {
			color: colors.white,
			backgroundColor: activeColor
		},

		'&.Mui-focusVisible': {
			borderColor: activeColor,
		},

		'&:disabled': {
			color: '#DCDFE7'
		}
	};
});
