import {
	AuthResponseDto,
	RefreshDto,
	SignInWithEmailDto,
	SignUpWithPhoneDto,
	IdDto,
	AuthVerifyDto,
	SignInWithPhoneDto,
	SignUpWithEmailDto
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
		authWithGoogleToken: builder.mutation<AuthResponseDto, string>({
			query: idToken => ({
				url: 'auth/google',
				method: 'POST',
				body: { idToken }
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
		registerWithEmail: builder.mutation<AuthResponseDto, SignUpWithEmailDto>({
			query: data => ({
				url: 'auth/sign-up/email',
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
		registerWithPhone: builder.mutation<AuthResponseDto, SignUpWithPhoneDto>({
			query: data => ({
				url: 'auth/sign-up/phone',
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
		signInWithPhone: builder.mutation<AuthResponseDto, SignInWithPhoneDto>({
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
		signInWithEmail: builder.mutation<AuthResponseDto, SignInWithEmailDto>({
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
	useRegisterWithPhoneMutation,
	useRegisterWithEmailMutation,
	useAuthWithGoogleTokenMutation
} = authApi;
