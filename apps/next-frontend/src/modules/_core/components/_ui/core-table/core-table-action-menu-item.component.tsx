import React, { FC, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { ActionMenuItem } from "./core-table-action-menu.component";
import { CoreSelectMenuItem } from "../core-select";
import { CoreTooltip } from "../core-tooltip";

interface CoreTableActionMenuItemProps extends ActionMenuItem {
	onClose(): void;
}

export const CoreTableActionMenuItem: FC<CoreTableActionMenuItemProps> = (props) => {
	const { tooltip, onClick, label, icon, onClose, disabled, ...menuProps } = props;

	const handleClick = useCallback(() => {
		onClose();
		onClick?.();
	}, [onClick, onClose]);

	const renderMenuItem = () => (
		<CoreSelectMenuItem
			{...menuProps}
			customContainer
			disabled={disabled}
			onClick={handleClick}
			sx={{ height: 38 }}
		>
			{icon}
			<Typography variant="body2" noWrap sx={{ ml: 1 }}>
				{label}
			</Typography>
		</CoreSelectMenuItem>
	);

	const renderItemWithWrapper = () => {
		if (disabled && tooltip) {
			return (
				<Box component="div">
					{renderMenuItem()}
				</Box>
			);
		}

		return renderMenuItem();
	};

	return (
		<CoreTooltip
			title={tooltip}
			placement="left"
			arrow
		>
			{renderItemWithWrapper()}
		</CoreTooltip>
	);
};
