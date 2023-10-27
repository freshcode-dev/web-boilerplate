import {
	AuthResponseDto,
	RefreshDto,
	SignInDto,
	SignUpDto,
	IdDto,
	AuthVerifyDto
} from '@boilerplate/shared';
import api from '.';
import { updateSessionAction } from '../../modules/auth';

const authApi = api.injectEndpoints({
	endpoints: builder => ({
		sendOtp: builder.mutation<IdDto, AuthVerifyDto>({
			query: data => ({
				url: 'auth/send-otp',
				method: 'POST',
				body: data
			}),
			extraOptions: {
				skipAuth: true
			}
		}),
		refresh: builder.mutation<AuthResponseDto, RefreshDto>({
			query: data => ({
				url: 'auth/refresh',
				method: 'POST',
				body: data
			}),
			invalidatesTags: ['UserProfile'],
			extraOptions: {
				skipAuth: true
			}
		}),
		register: builder.mutation<AuthResponseDto, SignUpDto>({
			query: data => ({
				url: 'auth/sign-up',
				method: 'POST',
				body: data
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const response = await queryFulfilled;
					dispatch(updateSessionAction(response.data));
				} catch { /* empty */ }
			},
			invalidatesTags: ['UserProfile'],
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
			invalidatesTags: ['UserProfile'],
			extraOptions: {
				skipAuth: true
			}
		})
	}),
});

export default authApi;

export const {
	useSendOtpMutation,
	useSignInMutation,
	useRegisterMutation
} = authApi;
