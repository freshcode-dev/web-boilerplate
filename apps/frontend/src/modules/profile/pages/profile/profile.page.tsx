import React, { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from '@mui/material';
import ProfileCard from '../../components/profile/profile-card.component';
import { useAppDispatch } from '../../../../store';
import { signOutAction } from '../../../auth';
import { useGetProfileQuery } from '../../../../store/api/auth.api';
import { CoreNavTabs, NavTab } from '../../../_core/components/_ui/core-nav-tabs';
import { ProfileRoutes } from '../../constants';

export const ProfilePage: FC = () => {
	const { data } = useGetProfileQuery();
	const dispatch = useAppDispatch();

	const [t] = useTranslation();

	const handleLogout = useCallback(() => {
		dispatch(signOutAction());
	}, [dispatch]);

	const tabs = useMemo<NavTab[]>(
		() => [
			{
				to: ProfileRoutes.Root,
				label: t('nav.profile'),
				id: 'auth-sign-in-panel',
				replace: true,
			},
			{
				to: ProfileRoutes.SecuritySettings,
				label: t('nav.security'),
				id: 'auth-sign-up-panel',
				replace: true,
			},
		],
		[t]
	);

	return (
		<Container component="main" maxWidth="xl">
			<CoreNavTabs tabs={tabs} />

			{data && <ProfileCard profile={data} onLogout={handleLogout} />}
		</Container>
	);
};
