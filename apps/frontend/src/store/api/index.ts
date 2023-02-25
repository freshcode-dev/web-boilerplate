import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { baseQueryWithReauth } from '../fetch-query';

const api = createApi({
	reducerPath: 'api',
	baseQuery: baseQueryWithReauth,
	endpoints: () => ({}),
	tagTypes: [],
});

export default api;
