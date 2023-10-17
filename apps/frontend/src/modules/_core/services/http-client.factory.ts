import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import configService from './config.service';
import { AppDispatch, RootState } from '../../../store';
import { isTokenExpired } from '../utils/token.utils';
import { refreshAction, signOutAction } from '../../auth';

const baseQuery = fetchBaseQuery({
	baseUrl: configService.get('NX_FRONT_APP_API_URL'),
	prepareHeaders: (headers, api) => {
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
			await dispatch(refreshAction(refresh)).unwrap();

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

	return response;
};
