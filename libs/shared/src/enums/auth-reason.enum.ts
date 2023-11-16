export enum AuthReasonEnum {
	SignIn = 'sign-in',
	SignUp = 'sign-up',
	Resend = 'resend',
	ChangePassword = 'change-password',
	ChangeEmail = 'change-email',
	ChangePhoneNumber = 'change-phone',
}

export const AuthReasonArray = [
	AuthReasonEnum.Resend,
	AuthReasonEnum.SignIn,
	AuthReasonEnum.SignUp
];
