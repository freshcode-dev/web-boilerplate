import React, { FC, ReactNode } from "react";
import { Box, ButtonBase, Typography } from "@mui/material";
import { NavLink } from 'react-router-dom';
import { createDrawerButtonBaseStyle } from "./drawer-button.styles";

interface DrawerButtonProps {
	children: string;
	icon?: ReactNode;
	collapsed?: boolean;
	to?: string;
	onClick?(): void;
}

export const DrawerButton: FC<DrawerButtonProps> = (props) => {
	const { children, onClick, collapsed, icon, to } = props;

	const Component = to ? NavLink : 'button';

	return (
		<ButtonBase
			onClick={onClick}
			aria-label={children}
			to={to}
			component={Component}
			sx={createDrawerButtonBaseStyle(collapsed)}
		>
			{icon && (
				<Box sx={{
					width: 24,
					height: 24
				}}>
					{icon}
				</Box>
			)}
			{!collapsed && (
				<Typography
					variant="body1"
					className="drawer-nav-link-label"
					component="span"
					noWrap
					sx={{
						color: theme => theme.colors.darkGray,
						pl: icon ? 1.5 : 0,
					}}
				>
					{children}
				</Typography>
			)}
		</ButtonBase>
	);
};
