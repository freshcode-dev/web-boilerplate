import { ACCESS_TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from '../../../_core/constants';
import { AuthResponseDto } from '@boilerplate/shared';
import { setTokenPair } from '../session.slice';
import usersApi from '../../../../store/api/users.api';
import { AppThunkConfig } from '../../../../store';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { createTokenPair } from '../../utils/token.utils';

export const updateSessionAction = createAsyncThunk<void, AuthResponseDto, AppThunkConfig>(
	'auth/sessionUpdate',
	(payload: AuthResponseDto, { dispatch }) => {
		const { accessToken, refreshToken, user } = payload;

		const tokenPair = createTokenPair(accessToken, refreshToken);

		if (!tokenPair.access) {
			return;
		}

		localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
		localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);

		dispatch(setTokenPair(tokenPair));

		dispatch(usersApi.util.upsertQueryData('getProfile', undefined, user));
	}
);
