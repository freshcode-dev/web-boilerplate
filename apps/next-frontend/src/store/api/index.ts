import { baseQueryWithReAuth } from '@/modules/_core/services';
import { createApi } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';

const api = createApi({
	reducerPath: 'api',
	baseQuery: baseQueryWithReAuth,
	endpoints: () => ({}),
	tagTypes: ['UserProfile'],
	extractRehydrationInfo(action, { reducerPath }) {
		if (action.type === HYDRATE) {
			return action['payload'][reducerPath];
		}
	},
});

export default api;
