import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { NextPageWithMeta, UserAgentType } from '@/modules/_core/types';
import { EmotionCache } from '@emotion/cache';
import { appWithTranslation, useTranslation } from 'next-i18next';
import createEmotionCache from 'src/theme/createEmotionCache';
import { IS_BROWSER, SELF_DOMAIN } from '@/constants';
import { AppStore, wrapper } from '@/store';
import { ErrorBoundary } from '@/modules/_core/components/error-boundary';
import { DeviceProvider } from '@/modules/_core/contexts';
import { Provider } from 'react-redux';
import { RootThemeProvider } from 'src/theme/RootThemeProvider';
import { CoreToast } from '@/modules/_core/components/_ui/core-toast';
import { SnackbarProvider } from 'notistack';
import { DefaultSeo } from 'next-seo';
import { SITE_DESCRIPTION, SITE_TITLE, SITE_TITLE_WITH_STAGE } from 'src/constants/seo.constants';
import { WrapPageWithMeta } from '@/modules/_core/utils/router.client.utils';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const clientSideUserAgent = IS_BROWSER ? navigator.userAgent : 'SSR';

export type AppCustomProps = AppProps & {
	Component: AppProps['Component'] & NextPageWithMeta;
	emotionCache?: EmotionCache;
	userAgent?: UserAgentType;
	lang?: string;
};

function CustomApp({ Component, userAgent = clientSideUserAgent, ...restProps }: AppCustomProps) {
	const [t] = useTranslation();

	const { store, props } = wrapper.useWrappedStore(restProps) as {
		store: AppStore;
		props: typeof restProps;
	};

	const { emotionCache = clientSideEmotionCache, pageProps } = props;

	return (
		<ErrorBoundary>
			<DeviceProvider userAgent={userAgent}>
				<Provider store={store}>
					<RootThemeProvider emotionCache={emotionCache}>
						<SnackbarProvider
							classes={{
								containerRoot: 'SnackbarContainerOffset',
							}}
							maxSnack={4}
							anchorOrigin={{
								horizontal: 'right',
								vertical: 'bottom',
							}}
							Components={{
								default: CoreToast,
								success: CoreToast,
								info: CoreToast,
								error: CoreToast,
							}}
						/>
						<Head>
							<meta
								name="viewport"
								content="width=device-width, maximum-scale=1, minimum-scale=1, initial-scale=1, user-scalable=no"
							/>
						</Head>

						<DefaultSeo
							defaultTitle={SITE_TITLE_WITH_STAGE(t)}
							description={SITE_DESCRIPTION(t)}
							openGraph={{
								type: 'website',
								url: SELF_DOMAIN,
								title: SITE_TITLE_WITH_STAGE(t),
								siteName: SITE_TITLE(t),
								description: SITE_DESCRIPTION(t),
								images: [
									{
										url: '/assets/logo-96x96.png',
										secureUrl: '/assets/logo-96x96.png',
										type: 'image/png',
										alt: 'Tradomatic Logo',
									},
								],
							}}
							twitter={{
								cardType: 'summary_large_image',
							}}
						/>

						{WrapPageWithMeta(Component, pageProps, t)}
					</RootThemeProvider>

				</Provider>

			</DeviceProvider>

		</ErrorBoundary>
	);
}

const AppWithTranslation: ReturnType<typeof appWithTranslation<AppCustomProps>> = appWithTranslation(CustomApp);

export default AppWithTranslation;
