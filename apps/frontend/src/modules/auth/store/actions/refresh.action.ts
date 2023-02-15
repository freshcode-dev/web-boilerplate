import { createAsyncThunk } from '@reduxjs/toolkit';
import { waitAsync } from '@boilerplate/shared';
import authApi from '../../../../store/api/auth.api';
import { clearSession, setAccessToken, setCurrentUser } from '../session.slice';
import { RootState } from '../../../../store';
import { Mutex } from 'async-mutex';

const REFRESH_KEY = 'refresh_mutation_key';

const refreshMutex = new Mutex();

// There are a few examples solving the same problem of debouncing multiple requests. Feel free rto remove any of them
const refreshActionWithMutex = createAsyncThunk<void, string>(
	'auth/refresh',
	async (body, { dispatch, rejectWithValue, getState }) => {
		try {
			if (refreshMutex.isLocked()) {
				await refreshMutex.waitForUnlock();

				return;
			}

			await refreshMutex.acquire();

			const refreshResult = await dispatch(authApi.endpoints.refresh.initiate(body, { fixedCacheKey: REFRESH_KEY })).unwrap();

			dispatch(clearSession());
			dispatch(setCurrentUser(refreshResult.user));
			dispatch(setAccessToken(refreshResult.authToken));

			return;
		} catch (error) {
			return rejectWithValue((error as Error).message);
		} finally {
			refreshMutex.release();
		}
	},
);

const refreshActionWithRtk = createAsyncThunk<void, string>(
  'auth/refresh',
  async (body, { dispatch, rejectWithValue, getState }) => {
    try {
			const currentActionStateSelector = authApi.endpoints.refresh.select({ fixedCacheKey: REFRESH_KEY, requestId: undefined });

			const waitAllParallelRequestsToFinish = async (): Promise<boolean> => {
				const currentActionState = currentActionStateSelector(getState() as RootState);

				if (!currentActionState.isLoading) {
					return false;
				}

				await waitAsync(200);
				await waitAllParallelRequestsToFinish();

				return true;
			};

			const anyParallelRequestsFulfilled = await waitAllParallelRequestsToFinish();

			if (anyParallelRequestsFulfilled) {
				return;
			}

			const refreshResult = await dispatch(authApi.endpoints.refresh.initiate(body, { fixedCacheKey: REFRESH_KEY })).unwrap();

			dispatch(clearSession());
			dispatch(setCurrentUser(refreshResult.user));
			dispatch(setAccessToken(refreshResult.authToken));

      return;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const refreshAction = refreshActionWithMutex;
