import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useI18nController = () => {
	const { i18n } = useTranslation();
	const [currentLanguage, setCurrentLanguage] = useState(i18n.resolvedLanguage);

	const changeLanguage = useCallback((lng?: string) => {
		i18n.changeLanguage(lng);
		setCurrentLanguage(lng);
	}, [i18n]);

	return {
		currentLanguage,
		changeLanguage,
		i18n
	}
};
