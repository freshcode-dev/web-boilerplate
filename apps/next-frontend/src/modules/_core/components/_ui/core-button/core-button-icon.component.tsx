import { FC } from "react";
import { styled } from "@mui/material/styles";
import { Box, BoxProps } from "@mui/material";

export const CoreButtonIcon: FC<BoxProps> = styled(Box)(() => ({
	marginRight: 12,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center'
}));
