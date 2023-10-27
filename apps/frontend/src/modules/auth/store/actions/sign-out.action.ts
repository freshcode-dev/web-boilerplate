import { createAsyncThunk } from '@reduxjs/toolkit';
import { clearSession } from '../..';
import {
	ACCESS_TOKEN_STORAGE_KEY,
	REFRESH_TOKEN_STORAGE_KEY
} from '../../../_core/constants';
import api from '../../../../store/api';

export const signOutAction = createAsyncThunk('auth/signOut', (_, { dispatch }) => {
	localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
	localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);

	dispatch(clearSession());
	dispatch(api.util.resetApiState());
});
