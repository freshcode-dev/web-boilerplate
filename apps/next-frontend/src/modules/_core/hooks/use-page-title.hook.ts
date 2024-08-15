import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';
import { useMatches } from './use-matches.hook';
import { STAGE_NAME_TO_DISPLAY, StageNameEnum } from '@/constants';
import { ITitleHandle } from '@/modules/_core/types/title-handle';

const stageToDisplay = STAGE_NAME_TO_DISPLAY === StageNameEnum.PROD ? '' : `-${STAGE_NAME_TO_DISPLAY}`;

export type UsePageTitleProps = {
	pageTitleType: 'title-tag' | 'header-tag';
	addSiteName?: boolean;
};

/**
 * Returns a current page title, based on the route params
 * @example { ...routeDefinition, handle: { title: 'nav.root-title' } }
 */
export const usePageTitle = ({ pageTitleType, addSiteName = false }: UsePageTitleProps): string => {
	const [t] = useTranslation();

	const matches = useMatches();

	return useMemo(() => {
		const matchWithTitle = matches.find(({ handle }) => !!(handle as ITitleHandle)?.title);

		if (!matchWithTitle) {
			return `${t('nav.root-title')}${addSiteName ? stageToDisplay : ''}`;
		}

		const handle = matchWithTitle.handle as ITitleHandle;

		if (handle.doNotShowPageHeader && pageTitleType === 'header-tag') {
			return '';
		}

		return `${t(handle.title)}${addSiteName ? ` / ${t('nav.root-title')}${stageToDisplay}` : ''}`;
	}, [matches, t, addSiteName, pageTitleType]);
};
