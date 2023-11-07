import { UserDto } from '@boilerplate/shared';
import api from '.';

const usersApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getProfile: builder.query<UserDto, void>({
			query: () => ({
				url: `users/profile`,
			}),
			providesTags: ['UserProfile'],
		}),
		getUserById: builder.query<UserDto, string>({
			query: (id) => ({
				url: `users/user/${id}`,
			}),
		}),
	}),
});

export default usersApi;

export const { useGetProfileQuery } = usersApi;
