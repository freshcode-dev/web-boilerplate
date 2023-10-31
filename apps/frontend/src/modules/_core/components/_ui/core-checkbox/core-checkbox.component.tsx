import React from "react";
import { styled } from "@mui/material/styles";
import { Checkbox, CheckboxProps } from "@mui/material";

export const CoreCheckbox: React.FC<CheckboxProps> = styled(Checkbox)(({ theme }) => ({
	'&.MuiCheckbox-root': {
		color: theme.colors.gray,

		'&.Mui-checked': {
			color: theme.colors.blue
		}
	}
}));
