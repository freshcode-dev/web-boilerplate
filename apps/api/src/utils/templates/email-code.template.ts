import { TemplateNamesEnum, compileHbsTemplate } from '.';

export const emailCodeSubject = () => 'Email verification code';

export interface IEmailCodeTemplate {
	code: string;
}

export const renderEmailCodeTemplate = async (locals: IEmailCodeTemplate) =>
	(await compileHbsTemplate(TemplateNamesEnum.EMAIL_CODE))(locals);
