import { SessionDto } from '@boilerplate/shared';
import api from '.';

const sessionsApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getSessionsList: builder.query<SessionDto[], { withIpDetails?: boolean } | undefined>({
			query: (filters) => ({
				url: `sessions/list`,
				params: filters,
			}),
		}),
		getCurrentSession: builder.query<SessionDto, { refreshToken: string; withIpDetails?: boolean }>({
			query: ({ refreshToken, withIpDetails }) => ({
				url: `sessions/current`,
				method: 'POST',
				body: {
					refreshToken,
				},
				params: { withIpDetails },
			}),
		}),
		interruptSession: builder.mutation<SessionDto, { session: SessionDto; refreshToken: string }>({
			query: ({ session, refreshToken }) => ({
				url: `sessions/session/interrupt`,
				method: 'POST',
				body: { ...session, refreshToken },
			}),
		}),
		interruptOtherSessions: builder.mutation<SessionDto[], string>({
			query: (refreshToken: string) => ({
				url: `sessions/others`,
				method: 'DELETE',
				body: {
					refreshToken,
				},
			}),
		}),
	}),
});

export default sessionsApi;

export const {
	useGetSessionsListQuery,
	useGetCurrentSessionQuery,
	useInterruptSessionMutation,
	useInterruptOtherSessionsMutation,
} = sessionsApi;
