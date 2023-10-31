import { styled } from "@mui/material/styles";
import { Chip, ChipProps } from "@mui/material";
import { StyledComponent } from "@emotion/styled";
import { ChipClose } from "../../../constants/icons.constants";

export const CoreAutocompleteChip: StyledComponent<ChipProps> = styled(
	(props: ChipProps) => <Chip {...props} deleteIcon={<ChipClose />}/>
)(({ theme }) => ({
	borderRadius: 8,
	paddingRight: 7,
	backgroundColor: theme.colors.black,

	'.MuiChip-deleteIcon': {
		minWidth: 16
	},

	'.MuiChip-label': {
		...theme.typography.label,
		color: theme.colors.white
	}
}));
