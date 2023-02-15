import { createAsyncThunk } from '@reduxjs/toolkit';
import { clearSession } from '../session.slice';
import { ACCESS_TOKEN_STORAGE_KEY } from '../../../_core/constants';

export const signOutAction = createAsyncThunk<void>(
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
