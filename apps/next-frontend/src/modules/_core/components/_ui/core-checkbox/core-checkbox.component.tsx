import React from "react";
import { styled } from "@mui/material/styles";
import { Checkbox, CheckboxProps } from "@mui/material";

export interface CoreCheckboxProps extends CheckboxProps {}

export const CoreCheckbox: React.FC<CoreCheckboxProps> = styled(Checkbox)(({ theme }) => ({
	'&.MuiCheckbox-root': {
		color: theme.colors.gray,

		'&.Mui-checked': {
			color: theme.colors.blue
		}
	}
}));
