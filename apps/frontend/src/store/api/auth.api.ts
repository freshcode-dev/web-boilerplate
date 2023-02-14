import { AuthResultDto, SignInDto } from '@boilerplate/shared';
import api from './';

const authApi = api.injectEndpoints({
	endpoints: builder => ({
		signIn: builder.mutation<AuthResultDto, SignInDto>({
			query: data => ({
				url: `auth/sign-in`,
				method: 'POST',
				body: data
			})
		}),
		refresh: builder.mutation<AuthResultDto, string>({
			query: refreshToken => ({
				url: `auth/refresh`,
				method: 'POST',
				body: {
					refreshToken
				}
			})
		}),
	}),
});

export default authApi;

export const { useSignInMutation } = authApi;
