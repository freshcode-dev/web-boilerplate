import path from 'path';
import pug, { Options, compileTemplate } from 'pug';

export enum TemplateNamesEnum {
	EMAIL_CODE = 'email-code',
	RESTORE_PASS = 'restore-pass',
}

export const pathToTemplates = path.resolve(__dirname, 'assets/templates');

export const compilePugTemplate = async (template: TemplateNamesEnum, options?: Options): Promise<compileTemplate> =>
	pug.compileFile(path.resolve(pathToTemplates, `${template}.pug`), options);
