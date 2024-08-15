import { ACCESS_TOKEN_COOKIE_KEY, REFRESH_TOKEN_COOKIE_KEY } from '@/constants';
import { AppThunkConfig } from '@/store';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthResponseDto } from '@boilerplate/shared';
import { setCookie } from 'cookies-next';
import { GetServerSidePropsContext } from 'next';
import { createTokenPair } from '../../utils/token.utils';
import { setTokenPair } from '../session.slice';
import { addMonths } from 'date-fns';

export const updateSessionAction = createAsyncThunk<void, { payload: AuthResponseDto, context?: GetServerSidePropsContext }, AppThunkConfig>(
	'auth/sessionUpdate',
	(arg, { dispatch }) => {
		const { payload, context } = arg;

		const { accessToken, refreshToken } = payload;

		const tokenPair = createTokenPair(accessToken, refreshToken);

		if (!tokenPair.access) {
			return;
		}

		setCookie(ACCESS_TOKEN_COOKIE_KEY, accessToken, {expires: addMonths(new Date(), 1), maxAge: 60 * 60 * 24 * 30});
		setCookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken, {expires: addMonths(new Date(), 1), maxAge: 60 * 60 * 24 * 30});

		dispatch(setTokenPair(tokenPair));
	}
);
