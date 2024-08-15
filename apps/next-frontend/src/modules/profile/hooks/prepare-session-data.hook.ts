import { useMemo } from 'react';
import { SessionDto } from '@boilerplate/shared';
import { prepareSession } from '@/modules/_core/utils/session.utils';

export const usePrepareSessionsData = ({
																				 currentSession,
																				 sessionsList,
																			 }: {
	currentSession?: SessionDto;
	sessionsList?: SessionDto[];
}) => {
	const preparedCurrentSession = useMemo(() => {
		if (!currentSession) return undefined;

		const session = prepareSession(currentSession);

		return session;
	}, [currentSession]);

	const preparedSessionsList = useMemo(
		() => (sessionsList?.filter((session) => session.id !== currentSession?.id) ?? []).map(prepareSession),
		[currentSession?.id, sessionsList]
	);

	return {
		currentSession: preparedCurrentSession,
		sessionsList: preparedSessionsList,
	};
};
