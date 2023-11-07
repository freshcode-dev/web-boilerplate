import React, { FC } from "react";
import { CoreActionButton, CoreActionButtonProps } from "./core-action-button.component";
import { CoreActionsRow } from "./core-actions-row.component";
import CoreTableActionMenu, { CoreTableActionMenuProps } from "./core-table-action-menu.component";

interface ButtonAction {
	type: 'button';
	props?: CoreActionButtonProps;
}

interface MenuAction {
	type: 'menu';
	props?: CoreTableActionMenuProps;
}

export type CellAction = (MenuAction | ButtonAction) & { id: string };

interface CoreTableActionsCellProps {
	actions: CellAction[];
}

export const CoreTableActionsCell: FC<CoreTableActionsCellProps> = (props) => {
	const { actions } = props;

	const renderAction = (action: CellAction) => {
		if (action.type === 'button') {
			return (
				<CoreActionButton
					key={action.id}
					sx={{ width: 32, height: 32 }}
					{...action.props}
				/>
			);
		}

		if (action.type === 'menu') {
			return (
				<CoreTableActionMenu
					key={action.id}
					{...action.props}
				/>
			);
		}

		return null;
	};

	return (
		<CoreActionsRow>
			{actions.map(renderAction)}
		</CoreActionsRow>
	);
};
