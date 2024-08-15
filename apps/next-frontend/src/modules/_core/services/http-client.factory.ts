import { BACKEND_API_BASE_URL } from '@/constants';
import { refreshAction, signOutAction } from '@/modules/auth/store';
import { AppDispatch, RootState } from '@/store';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { isTokenExpired } from '../utils/token.utils';

const createBaseQuery = (skipAuth?: boolean) => fetchBaseQuery({
	baseUrl: BACKEND_API_BASE_URL,
	prepareHeaders: (headers, api) => {
		if (skipAuth) return;

		const { access } = (api.getState() as RootState).session;

		if (access) {
			headers.set('Authorization', `Bearer ${access.token}`);
		}
	}
});

export const createError = (message: string): FetchBaseQueryError => ({
	status: 'CUSTOM_ERROR',
	error: message
});

export const baseQueryWithReAuth: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError,
	{ skipAuth?: boolean }
> = async (args, api, extraOptions) => {
	const baseQuery = createBaseQuery(extraOptions?.skipAuth);

	if (extraOptions?.skipAuth) {
		return baseQuery(args, api, extraOptions);
	}

	const { getState } = api;
	const dispatch = api.dispatch as AppDispatch;
	const { access, refresh } = (getState() as RootState).session;

	if (!access) {
		return {
			error: createError('Request requires credentials')
		};
	}

	const tryWithRefresh = async () => {
		try {
			await dispatch(refreshAction({ refresh })).unwrap();

			return baseQuery(args, api, extraOptions);
		} catch (error) {
			dispatch(signOutAction());

			return {
				error: createError('Failed to update session!')
			};
		}
	};

	if (isTokenExpired(access.payload)) {
		return tryWithRefresh();
	}

	const response = await baseQuery(args, api, extraOptions);

	if (response.error && response.error.status === 401) {
		return tryWithRefresh();
	}

	if (response.error) {
		if (response.error.status === 401) {
			return tryWithRefresh();
		}
	}

	return response;
};
