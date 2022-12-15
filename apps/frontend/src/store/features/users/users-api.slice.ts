import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { UserDto } from '@boilerplate/shared';
import configService from '../../../config/config.service';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: configService.get('NX_APP_API_URL') }),
  endpoints: (builder) => ({
    getUsers: builder.query<UserDto, string>({
      query: () => `users`,
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetUsersQuery } = usersApi