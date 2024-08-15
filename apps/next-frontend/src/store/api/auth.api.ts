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
	ChangeUserLoginRequest,
	ChangeUserLoginDto,
	RestorePasswordDto,
	ChangeUserPasswordDto,
} from '@boilerplate/shared';
import { signOutAction, updateSessionAction } from '@/modules/auth';
// should be last import
import api from '.';

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
					dispatch(updateSessionAction({ payload: response.data }));
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
			invalidatesTags: ['UserProfile'],
		}),
		registerWithEmail: builder.mutation<AuthResponseDto, SignUpWithEmailDto>({
			query: (data) => ({
				url: 'auth/sign-up/email',
				method: 'POST',
				body: data,
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				const response = await queryFulfilled;
				dispatch(updateSessionAction({ payload: response.data }));
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
				const response = await queryFulfilled;

				await dispatch(updateSessionAction({ payload: response.data }));
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
					dispatch(updateSessionAction({ payload: response.data }));
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
				url: `auth/restore-password-request`,
				method: 'POST',
				body: data,
			}),
			extraOptions: {
				skipAuth: true,
			},
		}),
		restorePassword: builder.mutation<void, RestorePasswordDto & { token?: string }>({
			query: ({ token, ...data }: RestorePasswordDto & { token?: string }) => ({
				url: `auth/restore-password`,
				method: 'POST',
				body: data,
				...(token
					? {
							headers: {
								authorization: `Bearer ${token}`,
							},
					  }
					: {}),
			}),
			invalidatesTags: ['UserProfile'],
			extraOptions: {
				skipAuth: true,
			},
		}),
		changeLoginRequest: builder.mutation<IdDto | undefined, ChangeUserLoginRequest>({
			query: (data) => ({
				url: `auth/change-login-request`,
				method: 'POST',
				body: data,
			}),
		}),
		changeLogin: builder.mutation<void, ChangeUserLoginDto>({
			query: (data) => ({
				url: `auth/change-login`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['UserProfile'],
		}),
		changePassword: builder.mutation<void, ChangeUserPasswordDto>({
			query: (data) => ({
				url: `auth/change-password`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['UserProfile'],
		}),
		signOut: builder.mutation<void, string>({
			query: (refreshToken) => ({
				url: `auth/sign-out`,
				method: 'POST',
				body: {
					refreshToken,
				},
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				await queryFulfilled;
				dispatch(signOutAction());
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
	useChangeLoginRequestMutation,
	useChangeLoginMutation,
	useChangePasswordMutation,
	useSignOutMutation,
} = authApi;
