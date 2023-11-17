import React, { FC } from 'react';
import { Box } from '@mui/material';
import { SessionsTable } from '../../components/sessions-table';
import { useFetchSessionsData } from '../../hooks/fetch-sessions-data.hook';
import { SessionCard } from '../../components/session-card/session-card.component';
import { usePrepareSessionsData } from '../../hooks/prepare-session-data.hook';
import { ProfileNavigation } from '../../components/profile-nav';
import { contentWrapperStyles } from './security-page.styles';

export const ProfileSecurityPage: FC = () => {
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
		<Box>
			<ProfileNavigation />

			<Box sx={contentWrapperStyles}>
				<SessionCard
					session={currentSession}
					isInterruptOtherSessionsLoading={isInterruptOtherSessionsLoading}
					handleInterruptOtherSessions={handleInterruptOtherSessions}
				/>

				{sessionsList && (
					<SessionsTable data={sessionsList} loading={loading} onDeleteSession={handleInterruptSession} />
				)}
			</Box>
		</Box>
	);
};
