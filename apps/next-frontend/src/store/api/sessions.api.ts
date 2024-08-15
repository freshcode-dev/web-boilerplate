import { SessionDto, SessionFilter } from '@boilerplate/shared';
// should be last import
import api from '.';

const sessionsApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getSessionsList: builder.query<SessionDto[], SessionFilter | undefined>({
			query: (filters) => ({
				url: `sessions/list`,
				params: filters,
			}),
		}),
		getCurrentSession: builder.query<SessionDto, { refreshToken: string } & SessionFilter>({
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
