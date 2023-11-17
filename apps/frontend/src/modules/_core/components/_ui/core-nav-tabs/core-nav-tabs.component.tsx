import React, { FC, useMemo, memo } from "react";
import { Tabs, Tab, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useRouteMatch } from "../../../hooks/use-route-match.hook";
import { coreNavTabsStyles, tabIndicatorStyles, tabStyle } from "./core-nav-tabs.styles";

export interface NavTab {
	id: string;
	to: string;
	label: string;
	icon?: React.ReactNode;
	replace?: boolean;
	disabled?: boolean;
	minWidth?: number | string;
}

interface CoreNavTabsProps {
	tabs: NavTab[];
	minTabWidth?: number | string;
}

export const CoreNavTabs: FC<CoreNavTabsProps> = memo((props) => {
	const { tabs, minTabWidth } = props;

	const routes = useMemo(() => tabs.map(tab => tab.to), [tabs]);
	const match = useRouteMatch(routes);
	const currentTab = match?.pattern.path;

	return (
		<Tabs
			value={currentTab}
			sx={coreNavTabsStyles}
			variant="fullWidth"
			TabIndicatorProps={{ sx: tabIndicatorStyles }}
		>
			{tabs.map(({ icon, label, id, to, replace, disabled, minWidth }) => (
				<Tab
					id={id}
					aria-controls={id}
					key={id}
					sx={{ ...tabStyle, minWidth: minWidth ?? minTabWidth }}
					value={to}
					disabled={disabled}
					replace={replace}
					component={Link}
					to={to}
					label={
						<Typography
							variant="h5"
							className="nav-tabs-label"
							sx={{
								display: 'flex',
								alignItems: 'center',
								columnGap: 1,
								textTransform: 'none'
							}}
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
