import { FC, PropsWithChildren } from 'react';
import ModalProvider from 'mui-modal-provider';
import Head from 'next/head';
import { usePageTitle } from '../hooks';
import { SystemStageBanner } from '../components/system-stage-banner';
import { PagePropsProvider, TPagePropsContextValue } from '@/modules/_core/contexts';

export interface CommonAreaProvidersProps {
	pageProps?: TPagePropsContextValue;
}

export const CommonAreaProviders: FC<PropsWithChildren<CommonAreaProvidersProps>> = (props) => {
	const { children, pageProps } = props;

	const pageTitle = usePageTitle({ pageTitleType: 'title-tag', addSiteName: true });

	return (
		<>
			<Head>
				<title>{pageTitle}</title>
			</Head>

			<PagePropsProvider value={pageProps}>
				<ModalProvider>
					<SystemStageBanner />

					{children}
				</ModalProvider>
			</PagePropsProvider>
		</>
	);
};
