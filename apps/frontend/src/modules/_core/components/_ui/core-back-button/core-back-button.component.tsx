import { ButtonBaseProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { StyledComponent } from "@emotion/styled";
import { CoreIconButton } from "../core-button";
import { ArrowLeftSmall } from "../../../constants/icons.constants";

export const CoreBackButton: StyledComponent<ButtonBaseProps> = styled((props: ButtonBaseProps) => (
	<CoreIconButton {...props}>
		<ArrowLeftSmall />
	</CoreIconButton>
))(({ theme }) => ({
	width: 40,
	height: 40,
	flexShrink: 0,
	borderRadius: 20,
	border: `1px solid ${theme.colors.blueTransparent}`
}));
