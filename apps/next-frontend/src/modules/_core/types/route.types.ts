import type { AppStore } from '@/store';
import { UserRolesEnum } from '@boilerplate/shared';
import type { NextPage } from 'next';
import { TFunction } from 'next-i18next';
import type { GetServerSidePropsCallback, GetStaticPropsCallback } from 'next-redux-wrapper';
import { NextSeoProps } from 'next-seo';
import type { ComponentType, PropsWithChildren } from 'react';
import { NavHandle } from './nav-handle';
import { ITitleHandle } from './title-handle';
import { NamespacesEnum } from '@/constants';

export type UserAgentType = 'SSR' | string;

export type HandleType = Partial<NavHandle & ITitleHandle>;

export type MyPageProps = {
	isBot?: boolean;
	user?: {
		id: string;
	} | null;
};

export type LayoutType = ComponentType<PropsWithChildren<{ pageProps: MyPageProps }>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NextPageWithMeta<Props extends { [key: string]: any } = MyPageProps, InitialProps = Props> = NextPage<
	Props,
	InitialProps
> & {
	layout?: LayoutType;
	seo?(t: TFunction, pageProps: Props): Partial<NextSeoProps>;
};

export type RouteDefinition = {
	path: string;
	handle?: HandleType;
	seo?(t: TFunction, pageProps: MyPageProps): Partial<NextSeoProps>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PageDefinition<Props extends { [key: string]: any } = object> = {
	namespaces?: NamespacesEnum[];
	requiresAuth?: boolean;
	allowedUserRoles?: UserRolesEnum[];
	getServerSideProps?: GetServerSidePropsCallback<AppStore, Props>;
	getStaticProps?: GetStaticPropsCallback<AppStore, Props>;
};
