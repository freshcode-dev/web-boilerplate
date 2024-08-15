import { LangCodesEnum } from "@boilerplate/shared";

export enum NamespacesEnum {
	Common = 'common',
	SignIn = 'sign-in',
	SignUp = 'sign-up',
	Profile = 'profile'
}

export const defaultLocale = LangCodesEnum.EN;

export const defaultNS = NamespacesEnum.Common;
export const namespaces: NamespacesEnum[] = [defaultNS, ...Object.values(NamespacesEnum)];

export const lookupLangQuerystring = 'lang';
export const lookupLangCookie = 'i18next';
export const lookupLangLocalStorage = 'i18nextLng';

export enum AllowedLanguagesEnum {
	English = 'en',
	All = 'all',
}

export interface LanguageOption {
	value: AllowedLanguage;
	label: string;
}

export interface PreferredReportsLanguageOption {
	value: AllowedLanguage;
	key: string;
}

export const LanguagesOptions: LanguageOption[] = [
	{
		value: AllowedLanguagesEnum.English,
		label: "English"
	},
];

export type AllowedLanguage = AllowedLanguagesEnum;

export const ALLOWED_LANGUAGES = LanguagesOptions.map(({ value }) => value);
