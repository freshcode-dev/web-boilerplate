import {
	AuthResponseDto,
	CreateUserDto,
	RefreshDto,
	SignInDto,
	UserDto
} from '@boilerplate/shared';
import api from '.';
import { updateSessionAction } from '../../modules/auth';

const authApi = api.injectEndpoints({
	endpoints: builder => ({
		refresh: builder.mutation<AuthResponseDto, RefreshDto>({
			query: data => ({
				url: 'auth/refresh',
				method: 'POST',
				body: data
			}),
			extraOptions: {
				skipAuth: true
			}
		}),
		register: builder.mutation<UserDto, CreateUserDto>({
			query: data => ({
				url: 'users',
				method: 'POST',
				body: data
			}),
			extraOptions: {
				skipAuth: true
			}
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
				} catch { /* empty */ }
			},
			extraOptions: {
				skipAuth: true
			}
		})
	}),
});

export default authApi;

export const { useSignInMutation, useRegisterMutation } = authApi;
