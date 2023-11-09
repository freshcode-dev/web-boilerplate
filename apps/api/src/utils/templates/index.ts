import pug, { Options, compileTemplate } from 'pug';

export enum TemplateNamesEnum {
	EMAIL_CODE = 'email-code',
	RESET_PASS = 'reset-pass',
}

export const pathToTemplates = `${__dirname}/../../assets/templates`;

export const compilePugTemplate = async (template: TemplateNamesEnum, options?: Options): Promise<compileTemplate> =>
	pug.compileFile(`${pathToTemplates}/${template}.pug`, options);
