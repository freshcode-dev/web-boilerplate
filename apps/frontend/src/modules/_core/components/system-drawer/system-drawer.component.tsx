import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CoreDrawer, DrawerLink } from '../_ui/core-drawer';
import { useCurrentAccessTokenSelector } from '../../../auth';
import { ProfileRoutes } from '../../../profile/constants';
import { AutoAwesomeMosaicOutlined as RootIcon, AutoAwesomeMosaic as RootFilledIcon } from '@mui/icons-material';

const SystemDrawer = () => {
	const [isSidebarVisible, setSidebarVisibility] = useState(true);

	const { t } = useTranslation();
	const currentToken = useCurrentAccessTokenSelector();

	const toggleSidebar = useCallback(() => {
		setSidebarVisibility((open) => !open);
	}, []);

	const links = useMemo<DrawerLink[]>(() => {
		if (!currentToken) {
			return [];
		}

		return [
			{
				route: ProfileRoutes.Root,
				label: t('nav.demo'),
				icon: <RootIcon />,
				activeIcon: <RootFilledIcon />,
			},
		];
	}, [t, currentToken]);

	return <CoreDrawer open={isSidebarVisible} onToggle={toggleSidebar} links={links} />;
};

export default SystemDrawer;
