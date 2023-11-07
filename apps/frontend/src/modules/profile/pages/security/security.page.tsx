import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Container, Typography } from '@mui/material';
import { REGISTER_CACHE_KEY, SIGN_IN_CACHE_KEY, VERIFY_CACHE_KEY } from '../../../auth';
import {
	useRegisterWithEmailMutation,
	useSignInWithPhoneMutation,
	useSignInWithEmailMutation,
	useSendOtpMutation,
} from '../../../../store/api/auth.api';
import { CoreNavTabs, NavTab } from '../../../_core/components/_ui/core-nav-tabs';
import { ProfileRoutes } from '../../constants';
import { SessionsTable } from '../../components/sessions-table';
import { useFetchSessionsData } from '../../hooks/fetch-sessions-data.hook';
import { SessionCard } from '../../components/session-card/session-card.component';
import { CoreButton } from '../../../_core/components/_ui/core-button';
import { usePrepareSessionsData } from '../../hooks/prepare-session-data.hook';

export const ProfileSecurityPage: FC = () => {
	const [t] = useTranslation();

	const [, { isLoading: registering }] = useRegisterWithEmailMutation({
		fixedCacheKey: REGISTER_CACHE_KEY,
	});
	const [, { isLoading: signingInWithEmail }] = useSignInWithEmailMutation({
		fixedCacheKey: SIGN_IN_CACHE_KEY,
	});

	const [, { isLoading: signingInWithPhone }] = useSignInWithPhoneMutation({
		fixedCacheKey: SIGN_IN_CACHE_KEY,
	});

	const [, { isLoading: verifying }] = useSendOtpMutation({
		fixedCacheKey: VERIFY_CACHE_KEY
	});

	const disableTabs = registering || signingInWithEmail || signingInWithPhone || verifying;

	const tabs = useMemo<NavTab[]>(
		() => [
			{
				to: ProfileRoutes.Root,
				label: t('nav.profile'),
				id: 'auth-sign-in-panel',
				replace: true,
				disabled: disableTabs,
			},
			{
				to: ProfileRoutes.SecuritySettings,
				label: t('nav.security'),
				id: 'auth-sign-up-panel',
				replace: true,
				disabled: disableTabs,
			},
		],
		[t, disableTabs]
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
