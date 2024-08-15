import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NamespacesEnum, defaultNS } from '@/constants';
import { localeDetector } from '@/modules/_core/classes/LangDetector';

export const getTranslateProps = async (context: GetServerSidePropsContext, ns: NamespacesEnum[] = []) => ({
	...(await serverSideTranslations(
		localeDetector.detect({ queryObject: context.query, cookieContext: context }),
		[defaultNS, NamespacesEnum.SignUp].concat(ns)
	)),
	// Should be passed to the page component props
});
