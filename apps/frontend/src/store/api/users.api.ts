import { UserDto } from '@boilerplate/shared';
import api from './';

const usersApi = api.injectEndpoints({
	endpoints: builder => ({
		getUsers: builder.query<UserDto[], void>({
			query: data => ({
				url: `users`
			})
		}),
	}),
});

export default usersApi;

export const { useGetUsersQuery } = usersApi;
