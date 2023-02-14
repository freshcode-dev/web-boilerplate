import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserDto } from '@boilerplate/shared';
import { useSelector } from 'react-redux';
import { useAppSelector } from 'apps/frontend/src/store';
import { ACCESS_TOKEN_STORAGE_KEY } from '../constants';

export interface SessionState {
	accessToken: string | null;
	currentUser?: UserDto | null;
}

export const initialState: SessionState = {
	accessToken: null,
	currentUser: null
};

export const sessionSlice = createSlice({
	name: 'session',
	initialState,
	reducers: {
		clearSession: (state: SessionState) => {
			state.accessToken = null;
			state.currentUser = null;
		},
		setCurrentUser: (state: SessionState, action: PayloadAction<UserDto>) => {
			state.currentUser = action.payload;
		},
		setAccessToken: (state: SessionState, action: PayloadAction<string>) => {
			if (action.payload) {
				localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, action.payload);
				state.accessToken = action.payload;
			} else {
				localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
				state.accessToken = null;
			}
		}
	}
});

export const { clearSession, setCurrentUser, setAccessToken } = sessionSlice.actions;

export const useCurrentAccessTokenSelector = () => useAppSelector(state => state.session.accessToken);
