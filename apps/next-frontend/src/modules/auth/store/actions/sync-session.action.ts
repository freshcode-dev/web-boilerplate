import { getCookie } from 'cookies-next';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { clearSession, setTokenPair } from '../session.slice';
import { createTokenPair } from '../../utils/token.utils';
import { ACCESS_TOKEN_COOKIE_KEY, REFRESH_TOKEN_COOKIE_KEY } from '@/constants';
import { AppThunkConfig } from '@/store';
import { GetServerSidePropsContext } from 'next';
// should be last import
import api from '@/store/api';

export const syncSessionAction = createAsyncThunk<void, GetServerSidePropsContext | undefined, AppThunkConfig>('auth/syncSession', (context, { dispatch }) => {
	const accessToken = getCookie(ACCESS_TOKEN_COOKIE_KEY, context) ?? null;
	const refreshToken = getCookie(REFRESH_TOKEN_COOKIE_KEY, context) ?? null;

	const tokenPair = createTokenPair(accessToken, refreshToken);

	if (!tokenPair.access) {
		dispatch(clearSession());
		dispatch(api.util.resetApiState());

		return;
	}

	dispatch(setTokenPair(tokenPair));
});
