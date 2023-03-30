import { createAsyncThunk } from '@reduxjs/toolkit';
import { clearSession } from '../..';
import { ACCESS_TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from '../../../_core/constants';

export const signOutAction = createAsyncThunk('auth/signOut', (_, { dispatch }) => {
	localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
	localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);

	dispatch(clearSession());
});
