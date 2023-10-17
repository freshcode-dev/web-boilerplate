import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import en from 'date-fns/locale/en-GB';
import { setDefaultOptions } from 'date-fns';

i18n
	.use(HttpBackend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		ns: ['common'],
		defaultNS: 'common',
		detection: {
			order: ['localStorage']
		},
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false
		}
	});

const getFnsLocale = (locale?: string) => {
	switch (locale) {
		case 'en':
			return en;
		default:
			return en;
	}
};

i18n.on("initialized", () => {
	setDefaultOptions({
		locale: getFnsLocale(i18n.resolvedLanguage)
	});
});

i18n.on('languageChanged', () => {
	setDefaultOptions({
		locale: getFnsLocale(i18n.resolvedLanguage)
	});
});

export default i18n;
