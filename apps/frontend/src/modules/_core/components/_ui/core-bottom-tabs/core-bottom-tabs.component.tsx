import React, { FC, ReactNode, memo } from 'react';
import { BottomNavigation } from '@mui/material';
import { navigatorStyles } from './core-bottom-tabs.styles';
import { CoreTabAction } from './core-tab-action.component';

export interface BottomTab {
	path: string;
	icon?: ReactNode;
	customIcon?: ReactNode;
	activeIcon?: ReactNode;
	label?: string | null;
}

interface CoreBottomTabsProps {
	tabs: BottomTab[];
}

export const CoreBottomTabs: FC<CoreBottomTabsProps> = memo((props) => {
	const { tabs } = props;

	return (
		<BottomNavigation sx={navigatorStyles}>
			{tabs.map((tab) => (
				<CoreTabAction key={tab.path} {...tab} />
			))}
		</BottomNavigation>
	);
});
