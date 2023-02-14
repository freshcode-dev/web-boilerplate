import { createAsyncThunk } from '@reduxjs/toolkit';
import { clearSession } from 'apps/frontend/src/modules/auth/store/session.slice';
import { ACCESS_TOKEN_STORAGE_KEY } from 'apps/frontend/src/modules/auth/constants';

export const signOutAction = createAsyncThunk<void, void>(
	'auth/sign-out',
	async (body, { dispatch, rejectWithValue, fulfillWithValue }) => {
		try {
			localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
			dispatch(clearSession());
		} catch (error) {
			rejectWithValue((error as Error).message);
		}
	},
);
