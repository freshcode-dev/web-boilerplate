import { createAsyncThunk } from '@reduxjs/toolkit';
import { ACCESS_TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from '../../../_core/constants';
import { clearSession, setTokenPair } from '../session.slice';
import { createTokenPair } from '../../utils/token.utils';
import api from '../../../../store/api';

export const syncSessionAction = createAsyncThunk('auth/syncSession', (_, { dispatch }) => {
	const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
	const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);

	const tokenPair = createTokenPair(accessToken, refreshToken);

	if (!tokenPair.access) {
		dispatch(clearSession());
		dispatch(api.util.resetApiState());

		return;
	}

	dispatch(setTokenPair(tokenPair));
});
