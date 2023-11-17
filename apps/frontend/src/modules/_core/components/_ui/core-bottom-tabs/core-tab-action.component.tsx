import { FC } from "react";
import { Link, useMatch } from "react-router-dom";
import { BottomNavigationAction } from "@mui/material";
import { BottomTab } from "./core-bottom-tabs.component";
import { CoreTabLabel } from "./core-tab-label.component";
import { CoreTabIcon } from "./core-tab-icon.component";

export const CoreTabAction: FC<BottomTab> = (props) => {
	const {
		path,
		label,
		icon,
		activeIcon,
		customIcon
	} = props;

	const match = useMatch({
		path,
		end: false
	});

	const isActive = !!match;

	return (
		<BottomNavigationAction
			component={Link}
			to={path}
			showLabel
			icon={(
				<CoreTabIcon active={isActive}>
					{isActive ? activeIcon : icon}
					{customIcon}
				</CoreTabIcon>
			)}
			label={(
				<CoreTabLabel
					label={label}
					active={isActive}
				/>
			)}
		/>
	);
};
