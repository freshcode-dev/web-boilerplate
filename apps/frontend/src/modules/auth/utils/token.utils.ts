import jwtDecode from 'jwt-decode';
import { SessionState } from '../store/session.slice';
import { JwtPayload } from '@boilerplate/shared';

export const createTokenPair = (access: string | null, refresh: string | null): SessionState => {
	try {
		if (!access || !refresh) {
			return {
				access: null,
				refresh: null
			};
		}

		const accessPayload = jwtDecode<JwtPayload>(access);
		const refreshPayload = jwtDecode<JwtPayload>(refresh);

		return {
			access: {
				token: access,
				payload: accessPayload
			},
			refresh: {
				token: refresh,
				payload: refreshPayload
			}
		};
	} catch {
		return {
			access: null,
			refresh: null
		};
	}
};
