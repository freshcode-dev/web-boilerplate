export const ErrorsMap = {
	isPhoneNumber: 'errors.phone-error',
	isEmail: 'errors.email-error',
	isUniquePhone: 'errors.phone-unique-error',
	isUniqueEmail: 'errors.email-unique-error',
};

export type ErrorKeys = keyof (typeof ErrorsMap);
