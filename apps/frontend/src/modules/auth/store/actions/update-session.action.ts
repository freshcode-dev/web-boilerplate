import { ACCESS_TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from '../../../_core/constants';
import { AuthResponseDto } from '@boilerplate/shared';
import { setTokenPair } from '../session.slice';
import usersApi from '../../../../store/api/users.api';
import { AppThunkConfig } from '../../../../store';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const updateSessionAction = createAsyncThunk<void, AuthResponseDto, AppThunkConfig>(
	'auth/sessionUpdate',
	(payload: AuthResponseDto, { dispatch }) => {
		const { accessToken, refreshToken, user } = payload;

		localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
		localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);

		dispatch(setTokenPair({
			accessToken,
			refreshToken
		}));

		dispatch(usersApi.util.upsertQueryData('getProfile', undefined, user));
	}
);
