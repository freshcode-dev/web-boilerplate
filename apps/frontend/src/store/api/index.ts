import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { baseQueryWithReAuth } from '../../modules/_core/services';

const api = createApi({
	reducerPath: 'api',
	baseQuery: baseQueryWithReAuth,
	endpoints: () => ({}),
	tagTypes: ['UserProfile'],
});

export default api;
