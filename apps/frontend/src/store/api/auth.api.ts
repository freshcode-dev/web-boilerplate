import {
	AuthResponseDto,
	RefreshDto,
	SignInWithEmailDto,
	IdDto,
	AuthVerifyDto,
	SignInWithPhoneDto,
	SignUpWithEmailDto,
	UserDto,
	EmailDto,
	PasswordDto,
} from '@boilerplate/shared';
import api from '.';
import { updateSessionAction } from '../../modules/auth';

const authApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getProfile: builder.query<UserDto, void>({
			query: () => ({
				url: `auth/profile`,
			}),
			providesTags: ['UserProfile'],
		}),
		sendOtp: builder.mutation<IdDto, AuthVerifyDto>({
			query: (data) => ({
				url: 'auth/send-otp',
				method: 'POST',
				body: data,
			}),
			extraOptions: {
				skipAuth: true,
			},
		}),
		refresh: builder.mutation<AuthResponseDto, RefreshDto>({
			query: (data) => ({
				url: 'auth/refresh',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['UserProfile'],
			extraOptions: {
				skipAuth: true,
			},
		}),
		authWithGoogleToken: builder.mutation<AuthResponseDto, string>({
			query: (idToken) => ({
				url: 'auth/google',
				method: 'POST',
				body: { idToken },
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const response = await queryFulfilled;
					dispatch(updateSessionAction(response.data));
				} catch {
					/* empty */
				}
			},
			invalidatesTags: ['UserProfile'],
			extraOptions: {
				skipAuth: true,
			},
		}),
		assignGoogleAccount: builder.mutation<void, string>({
			query: (idToken) => ({
				url: 'auth/google/assign',
				method: 'POST',
				body: { idToken },
			}),
		}),
		registerWithEmail: builder.mutation<AuthResponseDto, SignUpWithEmailDto>({
			query: (data) => ({
				url: 'auth/sign-up/email',
				method: 'POST',
				body: data,
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const response = await queryFulfilled;
					dispatch(updateSessionAction(response.data));
				} catch {
					/* empty */
				}
			},
			invalidatesTags: ['UserProfile'],
			extraOptions: {
				skipAuth: true,
			},
		}),
		signInWithPhone: builder.mutation<AuthResponseDto, SignInWithPhoneDto>({
			query: (data) => ({
				url: `auth/sign-in/phone`,
				method: 'POST',
				body: data,
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const response = await queryFulfilled;
					dispatch(updateSessionAction(response.data));
				} catch {
					/* empty */
				}
			},
			invalidatesTags: ['UserProfile'],
			extraOptions: {
				skipAuth: true,
			},
		}),
		signInWithEmail: builder.mutation<AuthResponseDto, SignInWithEmailDto>({
			query: (data) => ({
				url: `auth/sign-in/email`,
				method: 'POST',
				body: data,
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const response = await queryFulfilled;
					dispatch(updateSessionAction(response.data));
				} catch {
					/* empty */
				}
			},
			invalidatesTags: ['UserProfile'],
			extraOptions: {
				skipAuth: true,
			},
		}),
		restorePasswordRequest: builder.mutation<void, EmailDto>({
			query: (data: EmailDto) => ({
				url: `auth/restore-request`,
				method: 'POST',
				body: data,
			}),
			extraOptions: {
				skipAuth: true,
			},
		}),
		restorePassword: builder.mutation<void, PasswordDto & { token: string }>({
			query: ({ token, ...data }: PasswordDto & { token: string}) => ({
				url: `auth/restore-password`,
				method: 'POST',
				body: data,
				headers: {
					authorization: `Bearer ${token}`,
				},
			}),
			extraOptions: {
				skipAuth: true,
			},
		}),
	}),
});

export default authApi;

export const {
	useGetProfileQuery,
	useSendOtpMutation,
	useSignInWithPhoneMutation,
	useSignInWithEmailMutation,
	useRegisterWithEmailMutation,
	useAuthWithGoogleTokenMutation,
	useAssignGoogleAccountMutation,
	useRestorePasswordRequestMutation,
	useRestorePasswordMutation,
} = authApi;
