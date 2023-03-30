import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from '../../../store';
import { TokenWithPayload } from '../interfaces';
import { createTokenPair } from '../utils/token.utils';
import { ACCESS_TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from '../../_core/constants';


export interface TokenPairWithPayload {
	access: TokenWithPayload;
	refresh: TokenWithPayload;
}

export type SessionState = { access: null; refresh: null } | TokenPairWithPayload;

export const initialState: SessionState = createTokenPair(
	localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY),
	localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY),
);

export const sessionSlice = createSlice({
	name: 'session',
	initialState,
	reducers: {
		clearSession: (state: SessionState) => {
			state.access = null;
			state.refresh = null;
		},
		setTokenPair: (state: SessionState, action: PayloadAction<TokenPairWithPayload>) => {
			const { access, refresh } = action.payload;

			state.access = access;
			state.refresh = refresh;
		}
	}
});

export const { setTokenPair, clearSession } = sessionSlice.actions;

export const useCurrentAccessTokenSelector = () => useAppSelector(state => state.session.access);
