export const ErrorsMap = {
	isPhoneNumber: 'errors.phone-error',
	isEmail: 'errors.email-error',
	isPassword: 'errors.password-error',
	isPasswordConfirmation: 'errors.password-not-match-error',
	isUniquePhone: 'errors.phone-unique-error',
	isUniqueEmail: 'errors.email-unique-error',
	isValidCredentials: 'errors.invalid-credentials-error',
};

export type ErrorKeys = keyof (typeof ErrorsMap);
