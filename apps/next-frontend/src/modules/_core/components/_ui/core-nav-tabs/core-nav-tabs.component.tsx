import React, { FC, useMemo, memo } from 'react';
import Link from 'next/link';
import { Tabs, Tab, Typography, SxProps, Theme } from '@mui/material';
import { useRouteMatch } from '@/modules/_core/hooks';
import { coreNavTabsStyles, tabIndicatorStyles, tabStyle } from './core-nav-tabs.styles';
import { clsx } from '@/modules/_core/utils/style.utils';

export interface NavTab {
	id: string;
	to: string;
	label: string;
	icon?: React.ReactNode;
	replace?: boolean;
	disabled?: boolean;
	minWidth?: number | string;
	sx?: SxProps<Theme>;
	textSx?: SxProps<Theme>;
	activeSx?: SxProps<Theme>;
	activeTextSx?: SxProps<Theme>;
}

export interface CoreNavTabsProps {
	tabs: NavTab[];
	tabsStyles?: SxProps<Theme>;
	minTabWidth?: number | string;
	tabIndicatorSx?(currentTab?: string): SxProps<Theme>;
}

export const CoreNavTabs: FC<CoreNavTabsProps> = memo((props) => {
	const { tabs, minTabWidth, tabsStyles, tabIndicatorSx } = props;

	const routes = useMemo(() => tabs.map((tab) => tab.to), [tabs]);
	const match = useRouteMatch(routes);
	const currentTab = match?.pathname;

	return (
		<Tabs
			value={currentTab}
			sx={clsx(coreNavTabsStyles, tabsStyles)}
			variant="fullWidth"
			TabIndicatorProps={{
				sx: clsx(tabIndicatorStyles, tabIndicatorSx?.(currentTab)),
			}}
		>
			{tabs.map(({ icon, label, id, to, replace, disabled, minWidth, sx, textSx, activeSx, activeTextSx }) => (
				<Tab
					id={id}
					aria-controls={id}
					key={id}
					sx={clsx({ ...tabStyle, minWidth: minWidth ?? minTabWidth }, sx, currentTab === to ? activeSx : {})}
					value={to}
					disabled={disabled}
					replace={replace}
					component={Link}
					href={to}
					label={
						<Typography
							variant="h5"
							className="nav-tabs-label"
							sx={clsx(
								{
									display: 'flex',
									alignItems: 'center',
									columnGap: 1,
									textTransform: 'none',
								},
								textSx,
								currentTab === to ? activeTextSx : {}
							)}
						>
							{icon}
							{label}
						</Typography>
					}
				/>
			))}
		</Tabs>
	);
});

CoreNavTabs.displayName = 'CoreNavTabs'; // Add the display name to fix eslint issue
