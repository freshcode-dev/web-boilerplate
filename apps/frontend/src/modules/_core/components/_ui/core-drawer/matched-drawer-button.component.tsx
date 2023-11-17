import React, { FC, ReactNode } from "react";
import { useMatch } from "react-router-dom";
import { DrawerButton } from "./drawer-button.component";

interface MatchedDrawerButtonProps {
	children: string;
	to: string;
	collapsed: boolean;
	icon?: ReactNode;
	activeIcon?: ReactNode;
}

export const MatchedDrawerButton: FC<MatchedDrawerButtonProps> = (props) => {
	const { children, to, collapsed, icon, activeIcon } = props;

	const match = useMatch({
		path: to,
		end: false
	});

	return (
		<DrawerButton
			collapsed={collapsed}
			to={to}
			icon={match ? activeIcon : icon}
		>
			{children}
		</DrawerButton>
	);
};
