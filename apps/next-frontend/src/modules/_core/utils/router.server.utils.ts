/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthRoutes } from '@/modules/auth/constants';
import { refreshAction, signOutAction } from '@/modules/auth/store';
import { ProfileRoutes } from '@/modules/profile/constants';
import { AppStore, wrapper } from '@/store';
import authApi from '@/store/api/auth.api';
import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, Redirect } from 'next';
import type { GetServerSidePropsCallback } from 'next-redux-wrapper';
import { userAgentFromString } from 'next/server';
import { isTokenExpired } from './token.utils';
import { MyPageProps, PageDefinition } from '@/modules/_core/types';
import { RootRoutes } from '@/constants';
import { makePathWithQuery, parseUrl } from './url.utils';
import { TokenWithPayload } from '@/modules/auth/types';
import { getTranslateProps } from '@/modules/_core/utils/i18n.utils';
// should be last import
import api from '@/store/api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PropsType<Props = MyPageProps> = {
	props: Props | Promise<Props>;
};

type RedirectType = {
	redirect: Redirect;
};

type NotFoundType = {
	notFound: true;
};

type MyGetServerSidePropsResult = PropsType | RedirectType | NotFoundType;

export const redirectToLogin = (redirectParam?: string): Redirect => ({
	destination: `${AuthRoutes.LoginPhone}${redirectParam && !redirectParam.includes('.json') ? `?redirect=${encodeURIComponent(redirectParam)}` : ''
		}`,
	permanent: false,
});

export const redirect = (redirectPath?: string): Redirect => ({
	destination: redirectPath || RootRoutes.Root,
	permanent: false,
});

export const ensureForUnauthorizedAndAuthorizedUsers =
	(store: AppStore) =>
		async (
			context: GetServerSidePropsContext,
			pageDefinition?: PageDefinition | null,
			isRequireAuthorized?: boolean
		): Promise<MyGetServerSidePropsResult> => {
			const dispatch = store.dispatch;

			async function refreshActions(refresh?: TokenWithPayload) {
				if (!refresh) {
					throw new Error('No refresh token');
				}

				await dispatch(refreshAction({ refresh, context })).unwrap();
			}

			async function signOutActions(refreshToken?: string) {
				if (refreshToken) {
					await dispatch(authApi.endpoints.signOut.initiate(refreshToken));
				}

				dispatch(signOutAction(context));
			}

			function getRedirectPathParam() {

				const redirectURL = parseUrl(context.req.url, `http://${context.req.headers.host}`);


				let redirectPathParam =
					makePathWithQuery({
						pathname: redirectURL?.pathname,
						query: redirectURL?.searchParams,
					}) ?? '';

				if (redirectPathParam.includes(ProfileRoutes.Root)) {
					redirectPathParam = '';
				}

				return redirectPathParam;
			}

			const accessToken = store.getState().session.access;
			const refreshToken = store.getState().session.refresh;

			const jwtPayload = accessToken?.payload;

			const isAuthorized = accessToken && refreshToken;


			if (isRequireAuthorized) {
				if (!isAuthorized) {
					await signOutActions();

					const redirectPathParam = getRedirectPathParam();


					return {
						redirect: redirectToLogin(redirectPathParam),
					};
				}
			}

			if (isAuthorized) {
				if (isTokenExpired(accessToken.payload)) {
					try {
						await refreshActions(refreshToken);

						return {
							redirect: {
								destination: context.resolvedUrl,
								permanent: false,
							},
						};
					} catch (error) {
						await signOutActions(refreshToken.token);

						const redirectPathParam = getRedirectPathParam();

						return {
							redirect: redirectToLogin(redirectPathParam),
						};
					}
				}
			}

			return {
				props: {
					user: jwtPayload
						? {
							id: jwtPayload?.sub
						}
						: null,
				},
			};
		};

export const ensureForUnauthorizedUsers =
	(store: AppStore) =>
		async (
			context: GetServerSidePropsContext
		): Promise<MyGetServerSidePropsResult> => {

			const access = store.getState().session.access;

			if (access?.token) {
				// console.log('unauthorized -> has auth', !!access?.token);

				let redirectPathParam: string | undefined = context.query['redirect']
					? context.query['redirect'].toString()
					: undefined;

				if (redirectPathParam?.includes(AuthRoutes.Root)) {
					redirectPathParam = undefined;
				}
				return {
					redirect: redirect(RootRoutes.Profile),
				};
			}

			return {
				props: {},
			};
		};

const getNotFoundProp = async (
	store: AppStore,
	context: GetServerSidePropsContext,
	overridePageProps?: NotFoundType,
	componentPageProps?: NotFoundType,
	page?: PageDefinition | null
) => {
	// override props > component props
	const notFound = overridePageProps?.notFound ?? componentPageProps?.notFound;

	return notFound;
};

const getAuthProps = async (
	store: AppStore,
	context: GetServerSidePropsContext,
	pageDefinition?: PageDefinition | null
): Promise<MyGetServerSidePropsResult> => {
	const { isBot } = userAgentFromString(context.req.headers['user-agent']);

	// skip auth checks for bots - they don't have cookies
	// requiresAuth === true -> check for auth and roles
	// requiresAuth === false -> check for unauthorized status
	// requiresAuth === undefined -> no checks (public page)
	const result: GetServerSidePropsResult<MyPageProps> | undefined = isBot
		? undefined
		: pageDefinition?.requiresAuth
			? await ensureForUnauthorizedAndAuthorizedUsers(store)(context, pageDefinition, true)
			: pageDefinition?.requiresAuth === false
				? await ensureForUnauthorizedUsers(store)(context)
				: await ensureForUnauthorizedAndAuthorizedUsers(store)(context, pageDefinition, false)

	const props: MyPageProps = Object.assign((result as PropsType)?.props ?? {}, { isBot });

	return {
		redirect: (result as RedirectType)?.redirect,
		props,
	};
};

const getRedirectProp = (
	store: AppStore,
	context: GetServerSidePropsContext,
	overridePageProps?: RedirectType,
	componentPageProps?: RedirectType,
	authProps?: RedirectType,
	page?: PageDefinition | null
) => {
	// override props > auth props > component props
	const redirect = overridePageProps?.redirect ?? authProps?.redirect ?? componentPageProps?.redirect;

	return redirect;
};

const getPageProps = async (
	store: AppStore,
	context: GetServerSidePropsContext,
	overridePageProps?: PropsType,
	componentPageProps?: PropsType,
	authProps?: PropsType,
	page?: PageDefinition | null
) => {
	// translate props and (override props combined with component props)
	// priority = auth props > override props > component props > translate props
	const props = {
		...(await getTranslateProps(context, page?.namespaces)),
		...((await componentPageProps?.props) ?? {}),
		...((await overridePageProps?.props) ?? {}),
		...((await authProps?.props) ?? {}),
	};

	return props;
};

export const composeGetServerSideProps = (
	pageDefinition?: PageDefinition | null,
	overrideGetServerSideProps?: GetServerSidePropsCallback<AppStore, object>
) =>
	wrapper.getServerSideProps((store) => async (context: GetServerSidePropsContext): ReturnType<GetServerSideProps> => {
		// console.log(' ');
		// console.log('=========', new Date().toISOString(), '=========');
		// console.log(' ');
		// console.log('route', context.resolvedUrl);
		// console.log('wrapper.getServerSideProps');

		// override page props - expression in /pages/page.tsx - has higher priority - primary used for redirects
		const overridePageProps = (await overrideGetServerSideProps?.(store)(context)) || {};

		// auth checks (with token refresh)
		const authChecksProps = await getAuthProps(store, context, pageDefinition);

		// after possible token refresh
		const accessToken = store.getState().session.access;
		const hasAuth = !!accessToken?.token;

		// component page props - getServerSideProps bined to component (Component.getPageServerSideProps) - has lowest priority - used for data prefetching
		const componentPageProps =
			(pageDefinition?.requiresAuth && !hasAuth
				? undefined
				: await pageDefinition?.getServerSideProps?.(store)(context)) || {};

		const redirect = getRedirectProp(
			store,
			context,
			<RedirectType>overridePageProps,
			<RedirectType>componentPageProps,
			<RedirectType>authChecksProps,
			pageDefinition
		);

		const props = await getPageProps(
			store,
			context,
			<PropsType>overridePageProps,
			<PropsType>componentPageProps,
			<PropsType>authChecksProps,
			pageDefinition
		);

		const notFound = await getNotFoundProp(
			store,
			context,
			<NotFoundType>overridePageProps,
			<NotFoundType>componentPageProps,
			pageDefinition
		);

		const dispatch = store.dispatch;
		await Promise.all(dispatch(api.util.getRunningQueriesThunk()));

		// console.log(' ')
		// console.log('return props');
		// if (notFound) console.log('not found', notFound);
		// else console.log('redirect', redirect);

		return {
			...componentPageProps,
			...overridePageProps,
			notFound,
			redirect: notFound ? undefined : redirect,
			props: notFound ?? redirect ? {} : props,
		};
	});
