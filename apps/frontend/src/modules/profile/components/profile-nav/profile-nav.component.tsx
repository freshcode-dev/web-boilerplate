import { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { profileNavRowStyles } from './profile-nav.styles';
import { CoreNavTabs, NavTab } from '../../../_core/components/_ui/core-nav-tabs';
import { ProfileRoutes } from '../../constants';
import { useSignOut } from '../../../auth';
import { LogoutButton } from '../logout-button';
import { useIsMobile } from '../../../_core/hooks/useis-mobile.hook';
import { PortraitOutlined, SecurityOutlined } from '@mui/icons-material';
import LockIcon from '@mui/icons-material/Lock';
import { useMuiModal } from '../../../_core/hooks';
import { ConfirmationModal, ConfirmationModalProps } from '../../../_core/components/confirmation-modal';

export const ProfileNavigation: FC = () => {
	const [t] = useTranslation();

	const isMobile = useIsMobile();

	const { openModal: openConfirmLogoutModal } = useMuiModal<ConfirmationModalProps>(ConfirmationModal);

	const handleLogout = useSignOut();

	const handleOpenLogoutConfirmModal = useCallback(() => {
		openConfirmLogoutModal({
			title: 'Are you sure you want to logout?',
			onSubmit: handleLogout,
			icon: <LockIcon />,
			leftButtonProps: {
				children: 'Cancel',
			},
			rightButtonProps: {
				children: 'Logout',
				variant: 'danger',
			},
		});
	}, [handleLogout, openConfirmLogoutModal]);

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

			<LogoutButton onLogout={handleOpenLogoutConfirmModal} hideLabel={isMobile} />
		</Box>
	);
};
