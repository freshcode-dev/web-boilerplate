import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import configService from '../../modules/_core/services/config.service';

const api = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({ baseUrl: configService.get('NX_APP_API_URL') }),
	endpoints: () => ({}),
	tagTypes: [],
});

export default api;
