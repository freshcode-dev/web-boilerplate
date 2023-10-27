export enum AuthReasonEnum {
	SignIn = 'sign-in',
	SignUp = 'sign-up',
	Resend = 'resend'
}

export const AuthReasonArray = [
	AuthReasonEnum.Resend,
	AuthReasonEnum.SignIn,
	AuthReasonEnum.SignUp
];
