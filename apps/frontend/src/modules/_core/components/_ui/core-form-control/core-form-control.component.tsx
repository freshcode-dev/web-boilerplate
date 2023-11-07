import React, { FC, ReactNode } from "react";
import { Box, FormControl, FormHelperText, FormLabel, SxProps, Theme } from "@mui/material";
import { labelStyle } from "./core-form-control.styles";
import { ExclamationTooltip } from "../exclamation-tooltip";

export interface CoreFormControlProps {
	label?: string | null;
	labelHint?: ReactNode | null;
	fullWidth?: boolean;
	controlSx?: SxProps<Theme>;
	focused?: boolean;
	disabled?: boolean;
	error?: boolean;
	id?: string;
	children?: ReactNode;
	requiredMark?: boolean;
	helperText?: string;
}

export const CoreFormControl: FC<CoreFormControlProps> = (props) => {
	const {
		helperText,
		children,
		id,
		label,
		labelHint,
		fullWidth,
		controlSx,
		focused,
		disabled,
		error,
		requiredMark
	} = props;

	return (
		<FormControl
			focused={focused}
			disabled={disabled}
			error={error}
			fullWidth={fullWidth}
			sx={controlSx}
		>
			{label && (
				<FormLabel
					htmlFor={id}
					sx={{
						display: 'flex',
						alignItems: 'center',
						mb: 1,
						'&.Mui-focused': {
							color: theme => theme.colors.blue
						},
						...labelStyle
					}}
				>
					{label}
					{requiredMark && (
						<Box
							component="span"
							sx={{ color: theme => theme.colors.red, ml: 0.5 }}
						>
							*
						</Box>
					)}
					{labelHint && (
						<ExclamationTooltip title={labelHint} iconSx={{ ml: 1 }} placement="top-end"/>
					)}
				</FormLabel>
			)}
			{children}
			{helperText && (
				<FormHelperText sx={{ ...labelStyle, mx: 0, mt: 1 }}>
					{helperText}
				</FormHelperText>
			)}
		</FormControl>
	);
};
