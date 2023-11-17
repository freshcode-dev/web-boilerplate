export enum AuthReasonEnum {
	SignIn = 'sign-in',
	SignUp = 'sign-up',
	ChangeEmail = 'change-email',
	ChangePhoneNumber = 'change-phone',
}

export const AuthReasonArray = [
	AuthReasonEnum.SignIn,
	AuthReasonEnum.SignUp,
	AuthReasonEnum.ChangeEmail,
	AuthReasonEnum.ChangePhoneNumber,
];
