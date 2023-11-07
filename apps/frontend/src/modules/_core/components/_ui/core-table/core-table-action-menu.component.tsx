import React, { FC, ReactNode, useCallback, useRef, useState } from "react";
import { CoreActionButton, CoreActionButtonProps } from "./core-action-button.component";
import { Dots } from "../../../constants/icons.constants";
import { Menu } from "@mui/material";
import { selectPaperStyles } from "../core-select/core-select.styles";
import { CoreTableActionMenuItem } from "./core-table-action-menu-item.component";

export interface ActionMenuItem {
	id: string;
	label: string;
	tooltip?: string | null;
	icon?: ReactNode;
	disabled?: boolean;
	onClick?(): void;
}

export interface CoreTableActionMenuProps extends CoreActionButtonProps {
	options?: ActionMenuItem[];
}

const CoreTableActionMenu: FC<CoreTableActionMenuProps> = (props) => {
	const { options, ...buttonProps } = props;

	const [open, setMenuVisibility] = useState(false);
	const anchorRef = useRef(null);

	const handleClose = useCallback(() => {
		setMenuVisibility(false);
	}, []);

	const handleOpen = useCallback(() => {
		setMenuVisibility(true);
	}, []);

	return (
		<>
			<CoreActionButton
				{...buttonProps}
				ref={anchorRef}
				onClick={handleOpen}
				className={open
					? 'active-button'
					: undefined}
				sx={{
					bgcolor: 'transparent',
					width: 32,
					height: 32
				}}
			>
				<Dots />
			</CoreActionButton>
			<Menu
				open={open}
				anchorEl={anchorRef.current}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right'
				}}
				PaperProps={{
					sx: selectPaperStyles
				}}
			>
				{options?.map(option => (
					<CoreTableActionMenuItem
						key={option.id}
						{...option}
						onClose={handleClose}
					/>
				))}
			</Menu>
		</>
	);
};

export default CoreTableActionMenu;
