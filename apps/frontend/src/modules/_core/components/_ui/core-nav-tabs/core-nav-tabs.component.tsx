import React, { FC, useMemo, memo } from "react";
import { Tabs, Tab, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useRouteMatch } from "../../../hooks/use-route-match.hook";
import { coreNavTabsStyles, tabIndicatorStyles, tabStyle } from "./core-nav-tabs.styles";

export interface NavTab {
	id: string;
	to: string;
	label: string;
	replace?: boolean;
	disabled?: boolean;
}

interface CoreNavTabsProps {
	tabs: NavTab[];
}

export const CoreNavTabs: FC<CoreNavTabsProps> = memo((props) => {
	const { tabs } = props;

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
			{tabs.map(({ label, id, to, replace, disabled }) => (
				<Tab
					id={id}
					aria-controls={id}
					key={id}
					sx={tabStyle}
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
								textTransform: 'none'
							}}
						>
							{label}
						</Typography>
					}
				/>
			))}
		</Tabs>
	);
});
