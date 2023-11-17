import { Box } from '@mui/material';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { profileNavRowStyles } from './profile-nav.styles';
import { CoreNavTabs, NavTab } from '../../../_core/components/_ui/core-nav-tabs';
import { ProfileRoutes } from '../../constants';
import { useSignOut } from '../../../auth';
import { LogoutButton } from '../logout-button';
import { useIsMobile } from '../../../_core/hooks/useis-mobile.hook';
import { PortraitOutlined, SecurityOutlined } from '@mui/icons-material';

export const ProfileNavigation: FC = () => {
	const [t] = useTranslation();

	const isMobile = useIsMobile();

	const handleLogout = useSignOut();

	const tabs = useMemo<NavTab[]>(
		() => [
			{
				to: ProfileRoutes.Profile,
				label: isMobile ? '' : t('nav.profile'),
				icon: isMobile ? <PortraitOutlined /> : undefined,
				id: 'profile-panel',
				replace: true,
			},
			{
				to: ProfileRoutes.SecuritySettings,
				label: isMobile ? '' : t('nav.security'),
				icon: isMobile ? <SecurityOutlined /> : undefined,
				id: 'profile-security-panel',
				replace: true,
			},
		],
		[t, isMobile]
	);

	return (
		<Box sx={profileNavRowStyles}>
			<CoreNavTabs tabs={tabs} minTabWidth={isMobile ? 0 : 200} />

			<LogoutButton onLogout={handleLogout} hideLabel={isMobile} />
		</Box>
	);
};
