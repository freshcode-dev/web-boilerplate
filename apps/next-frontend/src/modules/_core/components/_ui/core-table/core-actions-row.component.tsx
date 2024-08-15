import { FC } from "react";
import { Box, BoxProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export const CoreActionsRow: FC<BoxProps> = styled(Box)(() => ({
	display: 'flex',
	justifyContent: 'flex-end',
	width: '100%',
	flexWrap: 'nowrap',
	'& :not(:last-child)': {
		marginRight: 16
	}
}));

