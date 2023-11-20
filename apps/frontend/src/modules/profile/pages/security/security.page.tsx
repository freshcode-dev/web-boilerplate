import React, { FC, useCallback } from 'react';
import { Box } from '@mui/material';
import { SessionsTable } from '../../components/sessions-table';
import { useFetchSessionsData } from '../../hooks/fetch-sessions-data.hook';
import { SessionCard } from '../../components/session-card/session-card.component';
import { usePrepareSessionsData } from '../../hooks/prepare-session-data.hook';
import { useMuiModal } from '../../../_core/hooks';
import { ChangePasswordModal } from '../../components/change-password-modal';
import { useGetProfileQuery } from '../../../../store/api/auth.api';
import { contentWrapperStyles } from './security-page.styles';
import { ProfileNavigation } from '../../components/profile-nav';

export const ProfileSecurityPage: FC = () => {
	const { data: profile } = useGetProfileQuery();

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
		<Box>
			<ProfileNavigation />

			<Box sx={contentWrapperStyles}>
				<SessionCard
					session={currentSession}
					isInterruptOtherSessionsLoading={isInterruptOtherSessionsLoading}
					disableInterruptOtherSessions={!sessionsList?.length}
					openChangePasswordModal={handleOpenChangePasswordModal}
					interruptOtherSessions={handleInterruptOtherSessions}
				/>

				{sessionsList && (
					<SessionsTable data={sessionsList} loading={loading} onDeleteSession={handleInterruptSession} />
				)}
			</Box>
		</Box>
	);
};
