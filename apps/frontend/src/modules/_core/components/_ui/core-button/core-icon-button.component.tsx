import { styled } from "@mui/material/styles";
import { ButtonBase, ButtonBaseProps } from "@mui/material";
import { StyledComponent } from "@emotion/styled";

export const CoreIconButton: StyledComponent<ButtonBaseProps> = styled(ButtonBase)(({ theme }) => ({
	color: theme.colors.black,
	padding: '6px',
	borderRadius: '50%',
	alignItems: 'center',
	justifyContent: 'center',
	flexShrink: 0,
	transition: theme.transitions.create(['background-color'], {
		duration: theme.transitions.duration.short
	}),
	'&:hover': {
		backgroundColor: theme.colors.blueTransparentLight
	},
	'&.Mui-focusVisible, &:active': {
		backgroundColor: theme.colors.blueTransparent
	},
	'&.Mui-disabled': {
		color: theme.colors.blueTransparent
	}
}));

export default CoreIconButton;
