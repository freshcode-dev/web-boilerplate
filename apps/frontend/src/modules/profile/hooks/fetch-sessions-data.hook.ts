import { useCallback } from 'react';
import {
	useGetCurrentSessionQuery,
	useGetSessionsListQuery,
	useInterruptSessionMutation,
	useInterruptOtherSessionsMutation,
} from '../../../store/api/sessions.api';
import { useCurrentRefreshTokenSelector } from '../../auth';
import { SessionDto, SessionFilter } from '@boilerplate/shared';

export const useFetchSessionsData = (filters?: SessionFilter) => {
	const refreshToken = useCurrentRefreshTokenSelector();

	const { data: currentSession, isLoading: isGetCurrentSessionLoading } = useGetCurrentSessionQuery({ refreshToken: refreshToken?.token ?? '', withIpDetails: filters?.withIpDetails });

	const { data: sessionsList, isFetching: isListLoading, refetch: refetchSessionsList } = useGetSessionsListQuery({
		withIpDetails: filters?.withIpDetails,
	});

	const [interruptSession, { isLoading: isInterruptSessionLoading }] = useInterruptSessionMutation();

	const [interruptOtherSessions, { isLoading: isInterruptOtherSessionsLoading }] = useInterruptOtherSessionsMutation();

	const handleInterruptSession = useCallback(
		async (session: SessionDto) => {
			await interruptSession({ session, refreshToken: refreshToken?.token as string });

			await refetchSessionsList();
		},
		[refreshToken?.token, interruptSession, refetchSessionsList]
	);

	const handleInterruptOtherSessions = useCallback(async () => {
		await interruptOtherSessions(refreshToken?.token as string);

		await refetchSessionsList();
	}, [refreshToken?.token, interruptOtherSessions, refetchSessionsList]);

	return {
		currentSession,
		sessionsList,

		isListLoading,
		isGetCurrentSessionLoading,
		isInterruptSessionLoading,
		isInterruptOtherSessionsLoading,

		handleInterruptSession,
		handleInterruptOtherSessions,
	};
};
