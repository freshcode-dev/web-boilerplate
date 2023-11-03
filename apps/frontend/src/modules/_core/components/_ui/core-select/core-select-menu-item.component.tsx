import { forwardRef, FC } from "react";
import { styled } from "@mui/material/styles";
import { MenuItem, MenuItemProps, Typography } from "@mui/material";
import { CoreCheckbox } from "../core-checkbox/core-checkbox.component";
import { selectCheckboxStyles } from "./core-select.styles";

interface CoreSelectMenuItemProps extends MenuItemProps {
	withCheckbox?: boolean;
	noWrap?: boolean;
	customContainer?: boolean;
	forceSelected?: boolean;
}

export const CoreSelectMenuItem: FC<CoreSelectMenuItemProps> = styled(
	forwardRef<HTMLLIElement, CoreSelectMenuItemProps>((props, ref) => {
	const {
		forceSelected,
		withCheckbox,
		noWrap,
		selected,
		children,
		customContainer,
		...menuItemProps
	} = props;

	const isMenuItemSelected = forceSelected ?? selected;

	return (
		<MenuItem
			{...menuItemProps}
			ref={ref}
			selected={isMenuItemSelected}
		>
			{withCheckbox && (
				<CoreCheckbox
					checked={isMenuItemSelected}
					sx={selectCheckboxStyles}
				/>
			)}
			{customContainer && children}
			{!customContainer && (
				<Typography variant="label" noWrap={noWrap}>
					{children}
				</Typography>
			)}
		</MenuItem>
	);
}))(({ theme }) => ({
	padding: '0 16px',
	minHeight: 'auto',
	height: 34,

	'&.Mui-selected': {
		backgroundColor: theme.colors.blueTransparent
	},
	'&:hover': {
		backgroundColor: theme.colors.blueTransparentLight
	}
}));
