import { STAGE_NAME_TO_DISPLAY } from './env.constants';
import { TFunction } from 'next-i18next';
import { capitalize } from 'lodash';
import { StageNameEnum } from '@/constants/index';

export const SITE_TITLE = (t: TFunction) => t('seo.siteTitle');

export const SITE_TITLE_WITH_STAGE = (t: TFunction) => `${SITE_TITLE(t)}${STAGE_NAME_TO_DISPLAY !== StageNameEnum.PROD ? ` - ${capitalize(STAGE_NAME_TO_DISPLAY)}` : ''
}`;
export const SITE_DESCRIPTION = (t: TFunction) => t('seo.siteDescription');

export const LOGIN_PAGE_TITLE = (t: TFunction) => t('seo.loginPageTitle');
export const LOGIN_PAGE_DESCRIPTION = (t: TFunction) => t('seo.loginPageDescription');

export const SIGNUP_PAGE_TITLE = (t: TFunction) => t('seo.signupPageTitle');
export const SIGNUP_PAGE_DESCRIPTION = (t: TFunction) => t('seo.signupPageDescription');
