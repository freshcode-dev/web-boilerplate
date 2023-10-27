import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useLangParam = () => {
	const { i18n } = useTranslation();

	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		const language = searchParams.get('lang');

		if (!language) {
			return;
		}

		setSearchParams(prev => {
			prev.delete('lang');

			return prev;
		});

		i18n.changeLanguage(language);
	}, []);
};
