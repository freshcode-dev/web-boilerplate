import React, { FC, useCallback } from "react";
import { ActionMenuItem } from "./core-table-action-menu.component";
import { Box, Typography } from "@mui/material";
import { CoreSelectMenuItem } from "../core-select/core-select-menu-item.component";
import { CoreTooltip } from "../core-tooltip/core-tooltip.component";

interface CoreTableActionMenuItemProps extends ActionMenuItem {
	onClose(): void;
}

const CoreTableActionMenuItem: FC<CoreTableActionMenuItemProps> = (props) => {
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

export default CoreTableActionMenuItem;
