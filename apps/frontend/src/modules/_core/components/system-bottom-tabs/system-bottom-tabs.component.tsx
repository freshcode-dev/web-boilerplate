import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CoreBottomTabs, BottomTab } from '../_ui/core-bottom-tabs';
import { ProfileRoutes } from '../../../profile/constants';
import {
	AutoAwesomeMosaicOutlined as RootIcon,
	AutoAwesomeMosaic as RootFilledIcon,
	Person as UserFilledIcon,
	PersonOutlined as UserIcon,
} from '@mui/icons-material';

const SystemBottomTabs = () => {
	const { t } = useTranslation();

	const tabs = useMemo<BottomTab[]>(
		() => [
			{
				path: ProfileRoutes.Root,
				label: t('nav.demo'),
				icon: <RootIcon />,
				activeIcon: <RootFilledIcon />,
			},
			{
				path: ProfileRoutes.Profile,
				label: t('nav.profile'),
				icon: <UserIcon />,
				activeIcon: <UserFilledIcon />,
			},
		],
		[t]
	);

	return <CoreBottomTabs tabs={tabs} />;
};

export default SystemBottomTabs;
