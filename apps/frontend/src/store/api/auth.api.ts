import { AuthResponseDto, CreateUserDto, ErrorLogger, SignInDto, UserDto } from '@boilerplate/shared';
import api from '.';
import { updateSessionAction } from '../../modules/auth';

const authApi = api.injectEndpoints({
	endpoints: builder => ({
		register: builder.mutation<UserDto, CreateUserDto>({
			query: data => ({
				url: 'users',
				method: 'POST',
				body: data
			})
		}),
		signIn: builder.mutation<AuthResponseDto, SignInDto>({
			query: data => ({
				url: `auth/sign-in`,
				method: 'POST',
				body: data
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const response = await queryFulfilled;
					dispatch(updateSessionAction(response.data));
				} catch (error) {
					ErrorLogger.logError(error);
				}
			}
		})
	}),
});

export default authApi;

export const { useSignInMutation, useRegisterMutation } = authApi;
