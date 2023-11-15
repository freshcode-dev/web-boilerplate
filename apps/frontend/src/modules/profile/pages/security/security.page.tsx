import React, { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from '@mui/material';
import { CoreNavTabs, NavTab } from '../../../_core/components/_ui/core-nav-tabs';
import { ProfileRoutes } from '../../constants';
import { SessionsTable } from '../../components/sessions-table';
import { useFetchSessionsData } from '../../hooks/fetch-sessions-data.hook';
import { SessionCard } from '../../components/session-card/session-card.component';
import { usePrepareSessionsData } from '../../hooks/prepare-session-data.hook';
import { useMuiModal } from '../../../_core/hooks';
import { ChangePasswordModal } from '../../components/change-password-modal';
import { useGetProfileQuery } from '../../../../store/api/auth.api';

export const ProfileSecurityPage: FC = () => {
	const [t] = useTranslation();

	const { data: profile } = useGetProfileQuery();

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

	const { openModal: openChangePasswordModal } = useMuiModal(ChangePasswordModal);

	const handleOpenChangePasswordModal = useCallback(() => {
		openChangePasswordModal({
			email: profile?.email as string,
		});
	}, [openChangePasswordModal, profile?.email]);

	const {
		currentSession: currentSessionData,
		sessionsList: sessionsListData,
		handleInterruptSession,
		handleInterruptOtherSessions,
		isListLoading,
		isGetCurrentSessionLoading,
		isInterruptSessionLoading,
		isInterruptOtherSessionsLoading,
	} = useFetchSessionsData({
		withIpDetails: true,
	});

	const { currentSession, sessionsList } = usePrepareSessionsData({
		currentSession: currentSessionData,
		sessionsList: sessionsListData,
	});

	const loading = isGetCurrentSessionLoading || isListLoading || isInterruptSessionLoading;

	return (
		<Container component="main" maxWidth="xl">
			<CoreNavTabs tabs={tabs} />

			<SessionCard
				session={currentSession}
				openChangePasswordModal={handleOpenChangePasswordModal}
				disableInterruptOtherSessions={!sessionsList.length}
				interruptOtherSessions={handleInterruptOtherSessions}
				isInterruptOtherSessionsLoading={isInterruptOtherSessionsLoading}
			/>

			{sessionsList && <SessionsTable data={sessionsList} loading={loading} onDeleteSession={handleInterruptSession} />}
		</Container>
	);
};
