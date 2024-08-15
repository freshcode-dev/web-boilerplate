/* eslint-disable @typescript-eslint/no-unused-vars */
const fallbackLng = 'en';
const locales = ['en'];

const isBrowser = typeof window !== 'undefined';
const isDevMode = process.env.NODE_ENV === 'development';

/** @type {import('next-i18next').UserConfig} */
module.exports = {
	// debug: isDevMode,
	i18n: {
		defaultLocale: fallbackLng,
		locales,
		localeDetection: false,
	},
	localePath: './public/locales',
	fallbackLng,
	supportedLngs: locales,
};
