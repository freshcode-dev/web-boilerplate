import { TemplateNamesEnum, compileHbsTemplate } from '.';

export const emailCodeSubject = () => 'Email verification code';

export const emailReasonText = (reason: EmailCodeReasonsEnum) => {
	switch (reason) {
		case EmailCodeReasonsEnum.SignIn:
			return 'Sign in';
		case EmailCodeReasonsEnum.SignUp:
			return 'Sign up';
		case EmailCodeReasonsEnum.ChangeEmail:
			return 'Change login email';
		default:
			return 'Email verification';
	}
};

export const emailFooterReasonText = (reason: EmailCodeReasonsEnum) => {
	switch (reason) {
		case EmailCodeReasonsEnum.SignIn:
			return "If you haven't logged in recently, someone else might be trying to access your account. In such case please change your password immediately or contact us.";
		case EmailCodeReasonsEnum.SignUp:
			return "If you haven't registered an account recently, someone else might be trying to create account for your email. In such case please contact us.";
		case EmailCodeReasonsEnum.ChangeEmail:
			return "If you haven't requested a change of email recently, someone else might be trying to change your login email. In such case please contact us.";
		default:
			return '';
	}
};

export enum EmailCodeReasonsEnum {
	SignIn = 'signIn',
	SignUp = 'signUp',
	ChangeEmail = 'changeEmail',
	ChangePhoneNumber = 'changePhoneNumber',
}

export interface IEmailCodeTemplate {
	code: string;
	reason: EmailCodeReasonsEnum;
	reasonText?: string;
	footerReasonText?: string;
}

export const renderEmailCodeTemplate = async (locals: IEmailCodeTemplate) =>
	(await compileHbsTemplate(TemplateNamesEnum.EMAIL_CODE))({
		...locals,
		// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
		reasonText: locals.reasonText || emailReasonText(locals.reason),
		// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
		footerReasonText: locals.footerReasonText || emailFooterReasonText(locals.reason),
	});
