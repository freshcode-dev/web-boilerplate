import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useAppSelector } from '@/store';
import { getBrowserTokenPairFromCookies } from '../utils/token.utils';
import { HYDRATE } from 'next-redux-wrapper';
import { TokenPair, TokenPairWithPayload } from '../types';


export type SessionStateTokenPair = TokenPairWithPayload | TokenPair;

export type SessionState = SessionStateTokenPair & {
	lastPermissionsRevalidationTimestamp: number | null;
};

export const defaultState: SessionState = {
	access: null,
	refresh: null,
	lastPermissionsRevalidationTimestamp: null,
};

const initialState: SessionState = {
	...getBrowserTokenPairFromCookies(),
	lastPermissionsRevalidationTimestamp: null,
};

export const sessionSlice = createSlice({
	name: 'session',
	initialState,
	reducers: {
		clearSession: (state: SessionState) => {
			// console.log('clearSession');
			state.access = null;
			state.refresh = null;
			state.lastPermissionsRevalidationTimestamp = null;
		},
		setTokenPair: (state: SessionState, action: PayloadAction<SessionStateTokenPair>) => {
			// console.log('setTokenPair');
			const { access, refresh } = action.payload;

			state.access = access;
			state.refresh = refresh;
		},
		setLastPermissionsRevalidationTimestamp: (state: SessionState, action: PayloadAction<number>) => {
			state.lastPermissionsRevalidationTimestamp = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase<string, PayloadAction<any>>(HYDRATE, (state, action) => {
			return {
				...state,
				...action.payload?.session,
			};
		});
	},
});

export const { setTokenPair, clearSession } = sessionSlice.actions;

export const useCurrentAccessTokenSelector = () => useAppSelector((state) => state.session.access);
export const useCurrentRefreshTokenSelector = () => useAppSelector((state) => state.session.refresh);
