import { UserDto } from '@boilerplate/shared';
import { TemplateNamesEnum, compileHbsTemplate } from '.';

export const resetPassSubject = () => 'Reset password';

export interface IResetPassTemplate {
	profile: UserDto;
	resetLink: string;
}

export const renderResetPassTemplate = async (locals: IResetPassTemplate) =>
	(await compileHbsTemplate(TemplateNamesEnum.RESTORE_PASS))(locals);
