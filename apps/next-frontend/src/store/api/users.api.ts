import { UpdateUserDataDto, UserDto } from '@boilerplate/shared';
// should be last import
import api from '.';

const usersApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getUserById: builder.query<UserDto, string>({
			query: (id) => ({
				url: `users/user/${id}`,
			}),
		}),
		updateUser: builder.mutation<UserDto, { id: string; data: UpdateUserDataDto }>({
			query: ({ id, data }) => ({
				url: `users/user/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['UserProfile'],
		}),
	}),
});

export default usersApi;

export const { useGetUserByIdQuery, useUpdateUserMutation } = usersApi;
