import { createAsyncThunk } from '@reduxjs/toolkit';
import { syncSessionAction } from './sync-session.action';
import { AppThunkConfig, RootState } from '@/store';
import { updateSessionAction } from './update-session.action';
import { GetServerSidePropsContext } from 'next';
import { TokenWithPayload } from '../../types';
import { REFRESH_LOCK_KEY } from '@/constants';
import { requestLock } from '@/modules/_core/utils/lock.utils';
import { isTokenExpired } from '@/modules/_core/utils/token.utils';
// should be last import
import authApi from '@/store/api/auth.api';

export const refreshAction = createAsyncThunk<void, { refresh: TokenWithPayload; context?: GetServerSidePropsContext }, AppThunkConfig>('auth/refresh',
	async (arg, { dispatch, getState }) => {
	// console.log('refreshAction');

	const { refresh, context } = arg;

	const release = await requestLock(REFRESH_LOCK_KEY);

	try {
		if (isTokenExpired(refresh.payload)) {
			throw new Error('Refresh token expired!');
		}

		dispatch(syncSessionAction(context));

		const { refresh: actualToken } = (getState() as RootState).session;

		// console.log('refresh not equal', actualToken?.token !== refresh.token);

		if (actualToken?.token !== refresh.token) {
			return;
		}

		const result = await dispatch(authApi.endpoints.refresh.initiate(
			{ refreshToken: refresh.token },
			{ track: false }
		));

		if ('error' in result) {
			throw new Error('Failed to update session!');
		}

		dispatch(updateSessionAction({ payload: result.data, context }));

		// console.log('end refresh');
	} finally {
		release();
	}
});
