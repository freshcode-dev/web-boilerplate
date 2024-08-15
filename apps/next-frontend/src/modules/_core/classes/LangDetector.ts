import { getCookie } from 'cookies-next';
import type { ParsedUrlQuery } from 'querystring';
import type { GetServerSidePropsContext, NextPageContext } from 'next/types';
import type { RequestCookie, RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import {
	defaultLocale,
	lookupLangQuerystring,
	lookupLangCookie,
	IS_BROWSER,
	lookupLangLocalStorage,
} from '@/constants';

interface DetectorConfig {
	fallbackLng: string;
	detectionOrder: ('querystring' | 'cookie' | 'localStorage')[];
	lookupQuerystring: string;
	lookupCookie: string;
	lookupLocalStorage: string;
}

interface DetectLocaleOptions {
	querystring?: string;
	queryObject?: Record<string, string | string[]> | ParsedUrlQuery;
	queryMap?: { get(key: string): string | string[] | undefined | null };
	cookieContext?: NextPageContext | GetServerSidePropsContext;
	cookieMap?: { get(key: string): string | undefined | null } | RequestCookies;
}

class LocaleDetector {
	public readonly defaultConfig: DetectorConfig = {
		fallbackLng: defaultLocale,
		detectionOrder: ['querystring', 'cookie'],
		lookupQuerystring: lookupLangQuerystring,
		lookupCookie: lookupLangCookie,
		lookupLocalStorage: lookupLangLocalStorage,
	};

	private readonly config: DetectorConfig;

	constructor(config: Partial<DetectorConfig> = {}) {
		this.config = { ...this.defaultConfig, ...config };
	}

	public detect(options: DetectLocaleOptions = {}) {
		const { cookieContext, cookieMap, querystring, queryObject, queryMap } = options;

		const { fallbackLng, detectionOrder } = this.config;

		let locale: string | null = null;

		for (const detectMethod of detectionOrder) {
			if (locale) break;

			switch (detectMethod) {
				case 'querystring':
					locale = this.detectFromQueryType(querystring, queryObject, queryMap) ?? '';
					break;
				case 'cookie':
					locale = this.detectFromCookieType(cookieContext, cookieMap) ?? '';
					break;
				case 'localStorage':
					locale = this.detectFromLocalStorage() ?? '';
					break;
			}
		}

		return locale || fallbackLng;
	}

	public detectFromQueryType(
		queryString?: string,
		queryObject?: DetectLocaleOptions['queryObject'],
		queryMap?: DetectLocaleOptions['queryMap']
	) {
		let locale: string | null = null;

		if (queryMap) {
			locale = this.detectFromQueryMap(queryMap);
		} else if (queryObject) {
			locale = this.detectFromQueryObject(queryObject);
		} else if (queryString) {
			locale = this.detectFromQuerystring(queryString);
		}

		return locale ?? null;
	}

	public detectFromQuerystring(
		querystring: DetectLocaleOptions['querystring'] = IS_BROWSER ? window.location.search : ''
	) {
		const query = querystring.replace('?', '');

		const urlParams = new URLSearchParams(query);

		const locale = urlParams.get(this.config.lookupQuerystring) ?? null;

		if (Array.isArray(locale)) {
			return locale[0] ?? null;
		}

		return locale;
	}

	public detectFromQueryObject(queryObject?: DetectLocaleOptions['queryObject']) {
		const query = queryObject ?? {};

		const locale = query[this.config.lookupQuerystring] ?? null;

		if (Array.isArray(locale)) {
			return locale[0] ?? null;
		}

		return locale;
	}

	public detectFromQueryMap(queryMap?: DetectLocaleOptions['queryMap']) {
		const query = queryMap ?? { get: () => null };

		const locale = query.get(this.config.lookupQuerystring) ?? null;

		if (Array.isArray(locale)) {
			return locale[0] ?? null;
		}

		return locale;
	}

	public detectFromCookieContext(context?: DetectLocaleOptions['cookieContext']) {
		const cookieLocale = getCookie(this.config.lookupCookie, context);

		return cookieLocale ?? null;
	}

	public detectFromCookieMap(cookieMap?: DetectLocaleOptions['cookieMap']) {
		const cookie = cookieMap ?? { get: () => null };

		const locale = cookie.get(this.config.lookupCookie);

		if (typeof locale === 'string') return locale;

		return (locale as RequestCookie)?.value ?? null;
	}

	public detectFromCookieType(
		cookieContext?: DetectLocaleOptions['cookieContext'],
		cookieMap?: DetectLocaleOptions['cookieMap']
	) {
		let locale: string | null = null;

		if (cookieContext) {
			locale = this.detectFromCookieContext(cookieContext);
		} else if (cookieMap) {
			locale = this.detectFromCookieMap(cookieMap);
		}

		return locale ?? null;
	}

	public detectFromLocalStorage() {
		if (!IS_BROWSER) return null;

		const locale = window.localStorage.getItem(this.config.lookupLocalStorage) ?? null;

		return locale;
	}
}

export const localeDetector = new LocaleDetector();

export default LocaleDetector;
