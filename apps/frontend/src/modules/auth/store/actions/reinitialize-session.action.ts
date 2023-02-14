import { createAsyncThunk } from '@reduxjs/toolkit';
import { setAccessToken } from '../session.slice';
import { ACCESS_TOKEN_STORAGE_KEY } from '../../constants';

export const reinitializeSessionAction = createAsyncThunk<void, void>(
	'auth/reinit',
	async (_, { dispatch }) => {
		const tokenFromLocalStorage = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

		if (tokenFromLocalStorage) {
			dispatch(setAccessToken(tokenFromLocalStorage));
		}
	}
);
