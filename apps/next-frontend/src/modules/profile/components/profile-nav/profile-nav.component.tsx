import { FC, useCallback, useMemo } from 'react';
import { Box } from '@mui/material';
import { CoreNavTabs, NavTab } from '../../../_core/components/_ui/core-nav-tabs';
import { PortraitOutlined, SecurityOutlined } from '@mui/icons-material';
import LockIcon from '@mui/icons-material/Lock';
import { useIsMobile, useMuiModal } from '../../../_core/hooks';
import { ConfirmationModal, ConfirmationModalProps } from '../../../_core/components/confirmation-modal';
import { useTranslation } from 'next-i18next';
import { useSignOut } from '@/modules/auth/hooks/use-sign-out.hook';
import { profileNavRowStyles } from '@/modules/profile/components/profile-nav/profile-nav.styles';
import { ProfileRoutes } from '@/modules/profile/constants';
import { LogoutButton } from '@/modules/profile/components/logout-button';

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
				to: ProfileRoutes.Root,
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
