import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { lookupLangQuerystring } from '@/constants';
import { useI18nController } from '@/modules/_core/hooks/i18n-language-controller.hook';

export const useLangParam = () => {
	const { currentLanguage, changeLanguage } = useI18nController();

	const searchParams = useSearchParams();
	const router = useRouter();

	useEffect(() => {
		const language = searchParams?.get(lookupLangQuerystring);

		if (!language) {
			return;
		}

		changeLanguage(language);
	}, [currentLanguage, changeLanguage, router, searchParams]);
};
