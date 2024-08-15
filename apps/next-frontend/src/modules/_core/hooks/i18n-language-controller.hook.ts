import { useCallback, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { setCookie } from 'cookies-next';
import { useSearchParams } from 'next/navigation';
import { defaultLocale, LanguagesOptions, lookupLangCookie, lookupLangQuerystring } from '@/constants';
import { LangCodesEnum } from '@boilerplate/shared';
import { localeDetector } from '@/modules/_core/classes/LangDetector';

export const useI18nController = () => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const { i18n } = useTranslation();
	const [currentLanguage, setCurrentLanguage] = useState<LangCodesEnum>(() => {
		const locale = localeDetector.detect({
			querystring: searchParams.toString(),
		});

		const found = LanguagesOptions.find((option) => option.value === locale);

		return (found?.value ?? i18n.resolvedLanguage ?? defaultLocale) as LangCodesEnum;
	});

	const reloadPage = useCallback(() => {
		const { pathname } = router;

		const newSearchParams = new URLSearchParams(searchParams?.toString());
		newSearchParams.delete(lookupLangQuerystring);

		const search = newSearchParams.toString();

		const query = search ? `?${search}` : '';

		router.replace(`${pathname}${query}`);
		router.reload();
	}, [router, searchParams]);

	const changeLanguage = useCallback(
		(lng: string) => {
			setCurrentLanguage(lng as LangCodesEnum);
			i18n.changeLanguage(lng);
			setCookie(lookupLangCookie, lng ?? defaultLocale);

			// reload to fetch new page with translations
			reloadPage();
		},
		[i18n, reloadPage]
	);

	return {
		currentLanguage,
		changeLanguage,
		i18n,
	};
};
