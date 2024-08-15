import { ACCESS_TOKEN_COOKIE_KEY, REFRESH_TOKEN_COOKIE_KEY } from '@/constants';
import { JwtPayload } from '@boilerplate/shared';
import { getCookie } from 'cookies-next';
import { SessionStateTokenPair } from '../store/session.slice';
import { jwtDecode } from 'jwt-decode';

export const createTokenPair = (access: string | null, refresh: string | null): SessionStateTokenPair => {
	try {
		if (!access || !refresh) {
			return {
				access: null,
				refresh: null,
			};
		}

		const accessPayload = jwtDecode<JwtPayload>(access);
		const refreshPayload = jwtDecode<JwtPayload>(refresh);

		return {
			access: {
				token: access,
				payload: accessPayload,
			},
			refresh: {
				token: refresh,
				payload: refreshPayload,
			},
		};
	} catch {
		return {
			access: null,
			refresh: null,
		};
	}
};

export const getBrowserTokenPairFromCookies = (): SessionStateTokenPair => {
	const access = getCookie(ACCESS_TOKEN_COOKIE_KEY) ?? null;
	const refresh = getCookie(REFRESH_TOKEN_COOKIE_KEY) ?? null;

	return createTokenPair(access, refresh);
};
