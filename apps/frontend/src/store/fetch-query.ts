import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/dist/query/react';
import { Mutex } from 'async-mutex';
import { RootState } from ".";
import configService from '../modules/_core/services/config.service';
import { signOutAction, updateSessionAction } from '../modules/auth';
import { AuthResponseDto } from '@boilerplate/shared';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
	baseUrl: configService.get('NX_APP_API_URL'),
	prepareHeaders: (headers, api) => {
		const { accessToken } = (api.getState() as RootState).session;

		if (accessToken) {
			headers.set('Authorization', `Bearer ${accessToken}`);
		}

		return headers;
	}
});

export const baseQueryWithReauth: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
	> = async (args, api, extraOptions) => {
	await mutex.waitForUnlock();

	const result = await baseQuery(args, api, extraOptions);

	if (!result.error || result.error.status !== 401) {
		return result;
	}

	if (mutex.isLocked()) {
		await mutex.waitForUnlock();

		return baseQuery(args, api, extraOptions);
	}

	const release = await mutex.acquire();

	try {
		const { refreshToken } = (api.getState() as RootState).session;

		if (!refreshToken) {
			return result;
		}

		const response = await baseQuery(
			{
				url: '/auth/refresh',
				method: 'POST',
				body: {
					refreshToken
				}
			},
			api,
			extraOptions
		);

		if (response.data) {
			api.dispatch(updateSessionAction(response.data as AuthResponseDto));

			return baseQuery(args, api, extraOptions);
		} else {
			api.dispatch(signOutAction());
		}
	} finally {
		release();
	}

	return result;
};
