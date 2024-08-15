import { ACCESS_TOKEN_COOKIE_KEY, REFRESH_TOKEN_COOKIE_KEY } from '@/constants';
import { getCookie, getCookies } from 'cookies-next';
import { GetServerSidePropsContext } from 'next';
import { createTokenPair } from './token.utils';
import { SessionStateTokenPair } from '../types';

export const getSSRTokenPairFromCookies = (context: GetServerSidePropsContext): SessionStateTokenPair => {
	const { req, res } = context;

	// usage of next/headers/cookies - gives an error in runtime
	// so we use req.cookies inside getServerSideProps to get tokens
	const access = getCookie(ACCESS_TOKEN_COOKIE_KEY, {
		req,
		res,
	}) ?? null;
	const refresh = getCookie(REFRESH_TOKEN_COOKIE_KEY, {
		req,
		res,
	}) ?? null;

	return createTokenPair(access, refresh);
};
