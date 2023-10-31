import { useTranslation } from 'react-i18next';
import { useMatches } from 'react-router-dom';
import { useMemo } from 'react';
import { TitleHandle } from '../interfaces/title-handle.interface';

/**
 * Returns a current page title, based on the route params
 * @example { ...routeDefinition, handle: { title: 'nav.demo' } }
 */
export const usePageTitle = (): string => {
	const [t] = useTranslation();

	const matches = useMatches();

	return useMemo(() => {
		const matchWithTitle = matches.find(({ handle }) => !!(handle as TitleHandle)?.title);

		if (!matchWithTitle) {
			return t('nav.root-title') as string;
		}

		const handle = matchWithTitle.handle as TitleHandle;

		return t(handle.title) as string;
	}, [t, matches]);
};

