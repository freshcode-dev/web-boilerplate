import { styled } from "@mui/material/styles";
import { ButtonBase, ButtonBaseProps } from "@mui/material";
import { StyledComponent } from "@emotion/styled";

export interface CoreHeaderButtonProps extends ButtonBaseProps {
	selected?: boolean;
	small?: boolean;
}

export const CoreHeaderButton: StyledComponent<CoreHeaderButtonProps> = styled(
	ButtonBase,
	{ shouldForwardProp: name => name !== 'small' }
)<CoreHeaderButtonProps>
(({ theme, selected, small }) => ({
	width: small ? 56 : 64,
	height: small ? 56 : 64,
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: theme.colors.white,
	borderRadius: theme.shape.borderRadius,
	transition: theme.transitions.create(['background-color', 'border-color'], {
		duration: theme.transitions.duration.short
	}),

	border: '1px solid',
	borderColor: !selected
		? theme.colors.white
		: theme.colors.blue,

	'&:hover, &.Mui-focusVisible': {
		borderColor: !selected
			? theme.colors.blueTransparentLight
			: theme.colors.blue,
		backgroundColor: theme.colors.blueTransparentLight
	}
}));
