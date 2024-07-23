import { baseQueryWithReAuth } from '../../modules/_core/services';
import { createApi } from '@reduxjs/toolkit/query/react';

const api = createApi({
	reducerPath: 'api',
	baseQuery: baseQueryWithReAuth,
	endpoints: () => ({}),
	tagTypes: ['UserProfile'],
});

export default api;
