export enum LanguageEnum {
	English = '3fe1b09b-eeba-42da-a412-a4e2b26c005b'
}

export enum LangCodesEnum {
	EN = 'en'
}

export const LangCodeRegionEnum = {
	[LangCodesEnum.EN]: 'GB'
};

export const LanguageCode3Map: Record<LanguageEnum, string> = {
	[LanguageEnum.English]: 'eng'
};

export const LanguagesList = Object.values(LanguageEnum);

export const LangCodesList = Object.values(LangCodesEnum);
