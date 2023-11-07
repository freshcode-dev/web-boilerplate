import { UserDto } from '@boilerplate/shared';
import api from '.';

const usersApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getUserById: builder.query<UserDto, string>({
			query: (id) => ({
				url: `users/user/${id}`,
			}),
		}),
	}),
});

export default usersApi;

export const { useGetUserByIdQuery } = usersApi;
