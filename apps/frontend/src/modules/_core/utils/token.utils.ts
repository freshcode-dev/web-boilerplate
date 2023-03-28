import { JwtPayload } from 'jwt-decode';

export const isTokenExpired = (payload: JwtPayload): boolean => {
	const exp = payload.exp ?? 0;

	return new Date().getTime() >= exp * 1000;
};
