import path from 'path';
import fs from 'fs/promises';
import Handlebars from 'handlebars';

export enum TemplateNamesEnum {
	EMAIL_CODE = 'email-code',
	RESTORE_PASS = 'restore-pass',
}

export const pathToTemplates = path.resolve(__dirname, 'assets/templates');

export const compileHbsTemplate = async (
	template: TemplateNamesEnum,
	options?: CompileOptions | undefined
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<HandlebarsTemplateDelegate<any>> => {
	const filePath = path.resolve(pathToTemplates, `${template}.hbs`);
	const fileContent = await fs.readFile(filePath, 'utf-8');

	return Handlebars.compile(fileContent, options);
};
