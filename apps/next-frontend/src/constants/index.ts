import { NODE_ENV } from './env.constants';

export * from './env.constants';
export * from './routes.constants';
export * from './auth.constants';
export * from './i18n.constants';
export * from './seo.constants';

export const IS_DEV_MODE = NODE_ENV === 'development';
export const IS_BROWSER = typeof window !== 'undefined';

export const IS_PWA =
	IS_BROWSER &&
	(window.matchMedia('(display-mode: standalone)').matches ||
		('standalone' in window.navigator && (window.navigator.standalone as boolean)) ||
		document.referrer.includes('android-app://'));

export const MOBILE_BREAKPOINT = 'sm';
export const TABLET_BREAKPOINT = 'md';

export enum StageNameEnum {
	DEV = 'dev',
	STAGING = 'staging',
	PROD = 'prod',
}
