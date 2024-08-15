import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import { useMuiModal } from '../../../_core/hooks';
import { contentWrapperStyles } from './security-page.styles';
import { ProfileNavigation } from '../../components/profile-nav';
import UnauthorizedArea from '@/modules/_core/areas/unauthorized-area/unauthorized-area.component';
import { LOGIN_PAGE_DESCRIPTION, LOGIN_PAGE_TITLE, NamespacesEnum } from '@/constants';
import { NextPageWithMeta, PageDefinition } from '@/modules/_core/types';
import { useFetchSessionsData } from '@/modules/profile/hooks/fetch-sessions-data.hook';
import { useGetProfileQuery } from '@/store/api/auth.api';
import { ChangePasswordModal } from '@/modules/profile/components/change-password-modal';
import { usePrepareSessionsData } from '@/modules/profile/hooks/prepare-session-data.hook';
import { SessionCard } from '@/modules/profile/components/session-card/session-card.component';
import { SessionsTable } from '@/modules/profile/components/sessions-table';

export const ProfileSecurityPage: NextPageWithMeta = () => {
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

ProfileSecurityPage.layout = UnauthorizedArea;

ProfileSecurityPage.seo = (t) => ({
	title: LOGIN_PAGE_TITLE(t),
	description: LOGIN_PAGE_DESCRIPTION(t),
});

export const ProfileSecurityPageDefinition: PageDefinition = {
	namespaces: [NamespacesEnum.SignIn],
	requiresAuth: false
};
