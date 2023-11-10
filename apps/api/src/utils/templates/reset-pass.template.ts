import { UserDto } from '@boilerplate/shared';
import { TemplateNamesEnum, compilePugTemplate } from '.';

export const resetPassSubject = () => 'Reset password';

export interface IResetPassTemplate {
	profile: UserDto;
	resetLink: string;
}

export const renderResetPassTemplate = async (locals: IResetPassTemplate) =>
	(await compilePugTemplate(TemplateNamesEnum.RESTORE_PASS))(locals);
