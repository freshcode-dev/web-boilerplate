import { deleteCookie } from 'cookies-next';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ACCESS_TOKEN_COOKIE_KEY, REFRESH_TOKEN_COOKIE_KEY } from '@/constants';
import { clearSession } from '../session.slice';
import { GetServerSidePropsContext } from 'next';
import { AppThunkConfig } from '@/store';
// should be last import
import api from '@/store/api';

export const signOutAction = createAsyncThunk<void, GetServerSidePropsContext | undefined, AppThunkConfig>('auth/signOut', (context, { dispatch }) => {
	deleteCookie(ACCESS_TOKEN_COOKIE_KEY, context);
	deleteCookie(REFRESH_TOKEN_COOKIE_KEY, context);

	dispatch(clearSession());
	dispatch(api.util.resetApiState());
	dispatch(api.util.invalidateTags(['UserProfile']));
});
