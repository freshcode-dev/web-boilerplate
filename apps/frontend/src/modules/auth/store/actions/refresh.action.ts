import { createAsyncThunk } from '@reduxjs/toolkit';
import { TokenWithPayload } from '../../interfaces';
import { requestLock } from '../../../_core/utils/lock.utils';
import { REFRESH_LOCK_KEY } from '../../../_core/constants';
import { isTokenExpired } from '../../../_core/utils/token.utils';
import { syncSessionAction } from './sync-session.action';
import { AppThunkConfig, RootState } from '../../../../store';
import authApi from '../../../../store/api/auth.api';
import { updateSessionAction } from './update-session.action';

export const refreshAction = createAsyncThunk<void, TokenWithPayload, AppThunkConfig>('auth/refresh',
	async (refresh, { dispatch, getState }) => {
	const release = await requestLock(REFRESH_LOCK_KEY);

	try {
		if (isTokenExpired(refresh.payload)) {
			throw new Error('Refresh token expired!');
		}

		dispatch(syncSessionAction());

		const { refresh: actualToken } = (getState() as RootState).session;

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

		dispatch(updateSessionAction(result.data));
	} finally {
		release();
	}
});
