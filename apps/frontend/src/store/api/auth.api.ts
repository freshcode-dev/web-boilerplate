import {
	AuthResponseDto,
	RefreshDto,
	SignInEmailDto,
	SignUpDto,
	IdDto,
	AuthVerifyDto,
	SignInPhoneDto
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
		signInWithPhone: builder.mutation<AuthResponseDto, SignInPhoneDto>({
			query: data => ({
				url: `auth/sign-in/phone`,
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
		signInWithEmail: builder.mutation<AuthResponseDto, SignInEmailDto>({
			query: data => ({
				url: `auth/sign-in/email`,
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
	useSignInWithPhoneMutation,
	useSignInWithEmailMutation,
	useRegisterMutation
} = authApi;
