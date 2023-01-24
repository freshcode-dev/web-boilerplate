import React, { useState, useMemo } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { StylesExamplesTabsEnum } from "./styles-examples.types";
import { STYLES_EXAMPLES_TABS } from "./constants/pages.constant";

export const StylesExamplesPage = () => {
	const [tab, setTab] = useState<StylesExamplesTabsEnum>(StylesExamplesTabsEnum.SX_PROPS);
	const CurrentTab = useMemo(() => STYLES_EXAMPLES_TABS.find(({ id }) => id === tab)?.component, [tab]);

	const handleChange = (event: React.SyntheticEvent, newTab: StylesExamplesTabsEnum) => {
		setTab(newTab);
	};

	return (
		<Box display="flex" flexDirection="column" sx={{ width: '100%', height: '100vh'}}>
			<Tabs value={tab} onChange={handleChange} >
				{STYLES_EXAMPLES_TABS.map(({ id, title }) => (
					<Tab key={id} label={title} id={`tab-${id}`} value={id} />
				))}
			</Tabs>
			<Box sx={{ flex: 1 }}>
				{CurrentTab && (<CurrentTab />)}
			</Box>
		</Box>
	);
}

export default StylesExamplesPage;
