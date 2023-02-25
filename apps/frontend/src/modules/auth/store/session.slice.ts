import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from '../../../store';
import { ACCESS_TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from '../../_core/constants';
import { TokenPairDto } from '@boilerplate/shared';

export interface SessionState {
	accessToken: string | null;
	refreshToken: string | null;
}

export const initialState: SessionState = {
	accessToken: localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY),
	refreshToken: localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
};

export const sessionSlice = createSlice({
	name: 'session',
	initialState,
	reducers: {
		clearSession: (state: SessionState) => {
			state.accessToken = null;
			state.refreshToken = null;
		},
		setTokenPair: (state: SessionState, action: PayloadAction<TokenPairDto>) => {
			const { refreshToken, accessToken } = action.payload;

			state.accessToken = accessToken;
			state.refreshToken = refreshToken;
		}
	}
});

export const { setTokenPair, clearSession } = sessionSlice.actions;

export const useCurrentAccessTokenSelector = () => useAppSelector(state => state.session.accessToken);
