import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Container, Typography } from '@mui/material';
import { CoreNavTabs, NavTab } from '../../../_core/components/_ui/core-nav-tabs';
import { ProfileRoutes } from '../../constants';
import { SessionsTable } from '../../components/sessions-table';
import { useFetchSessionsData } from '../../hooks/fetch-sessions-data.hook';
import { SessionCard } from '../../components/session-card/session-card.component';
import { CoreButton } from '../../../_core/components/_ui/core-button';
import { usePrepareSessionsData } from '../../hooks/prepare-session-data.hook';

export const ProfileSecurityPage: FC = () => {
	const [t] = useTranslation();


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

			<Box>
				<Typography variant="h5">Current session</Typography>
				<SessionCard session={currentSession} />
			</Box>

			<CoreButton loading={isInterruptOtherSessionsLoading} onClick={handleInterruptOtherSessions}>
				{t('profile.sessions.signOutAllSessions')}
			</CoreButton>

			{sessionsList && <SessionsTable data={sessionsList} loading={loading} onDeleteSession={handleInterruptSession} />}
		</Container>
	);
};
