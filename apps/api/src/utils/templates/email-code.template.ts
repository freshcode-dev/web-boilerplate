import { TemplateNamesEnum, compilePugTemplate } from '.';

export const emailCodeSubject = () => 'Email verification code';

export interface IEmailCodeTemplate {
	code: string;
}

export const renderEmailCodeTemplate = async (locals: IEmailCodeTemplate) =>
	(await compilePugTemplate(TemplateNamesEnum.EMAIL_CODE))(locals);
