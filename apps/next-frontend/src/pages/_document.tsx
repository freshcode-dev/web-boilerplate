import type { AppType } from 'next/app';
import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentProps } from 'next/document';
import { Box, SxProps, Theme } from '@mui/material';
import createEmotionServer from '@emotion/server/create-instance';
import { fontColor, fontColorVar, grayColorVar, redColorVar, theme } from 'src/theme/theme';
import { SystemDocumentPWA } from '@/modules/_core/components/system-document-pwa';
import { SystemDocumentIcons } from '@/modules/_core/components/system-document-icons';
import { localeDetector } from '@/modules/_core/classes/LangDetector';
import createEmotionCache from 'src/theme/createEmotionCache';
import { AppCustomProps } from 'src/pages/_app';


const bodyStyles: SxProps<Theme> = {
	m: 0,
	height: '100%',


	[fontColorVar]: theme.colors.dark,
	[grayColorVar]: theme.colors.gray,
	[redColorVar]: theme.colors.red,

	color: fontColor,

	'& > #__next': {
		height: '100%',
	},
};

/* -==- Document -==- */

interface MyDocumentProps extends DocumentProps {
	i18nDocumentProps: {
		lang?: string;
	};
	emotionStyleTags: JSX.Element[];
}

export default function MyDocument(props: MyDocumentProps) {
	const { i18nDocumentProps, emotionStyleTags } = props;

	return (
		<Html {...i18nDocumentProps}>
			<Head>
				{/* <==> Meta <==> */}
				<meta charSet="UTF-8" />
				<meta name="theme-color" content={theme.palette.primary.main} />
				<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

				<meta name="referrer" content="no-referrer-when-downgrade" />

				{/* PWA meta */}
				<SystemDocumentPWA />

				{/* <==> Icons <==> */}
				<SystemDocumentIcons />

				{/* <==> Translate links <==> */}
				<link rel="canonical" href="https://app.tradomatic.io/?lang=uk" />
				<link rel="alternate" hrefLang="uk" href="https://app.tradomatic.io/?lang=uk" />
				<link rel="alternate" hrefLang="ru" href="https://app.tradomatic.io/?lang=uk" />
				<link rel="alternate" hrefLang="en" href="https://app.tradomatic.io/?lang=en" />

				{/* <==> Scripts <==> */}


				{/* <==> Styles <==> */}
				<link
					rel="stylesheet"
					type="text/css"
					charSet="UTF-8"
					href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css"
				/>
				<link
					rel="stylesheet"
					type="text/css"
					href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css"
				/>

				<meta name="emotion-insertion-point" content="" />
				{emotionStyleTags}
			</Head>

			<Box component="body" sx={bodyStyles}>
				<Main />
				<NextScript />
			</Box>
		</Html>
	);
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
	const i18nDocumentProps = getI18nDocumentPropsFromCtx(ctx);

	const { emotionStyleTags, ...initialProps } = await getEmotionStyleTagsPropsFromCtx(ctx, i18nDocumentProps.lang);

	return { ...initialProps, emotionStyleTags, i18nDocumentProps };
};

function getI18nDocumentPropsFromCtx(ctx: DocumentContext): Partial<MyDocumentProps['i18nDocumentProps']> {
	return {
		lang: localeDetector.detect({ queryObject: ctx.query, cookieContext: ctx }),
	};
}

// Source: https://github.com/mui/material-ui/blob/master/examples/material-ui-nextjs-pages-router/pages/_document.js
async function getEmotionStyleTagsPropsFromCtx(ctx: DocumentContext, lang?: string) {
	// Resolution order
	//
	// On the server:
	// 1. app.getInitialProps
	// 2. page.getInitialProps
	// 3. document.getInitialProps
	// 4. app.render
	// 5. page.render
	// 6. document.render
	//
	// On the server with error:
	// 1. document.getInitialProps
	// 2. app.render
	// 3. page.render
	// 4. document.render
	//
	// On the client
	// 1. app.getInitialProps
	// 2. page.getInitialProps
	// 3. app.render
	// 4. page.render

	const originalRenderPage = ctx.renderPage;

	// You can consider sharing the same Emotion cache between all the SSR requests to speed up performance.
	// However, be aware that it can have global side effects.
	const cache = createEmotionCache();
	const { extractCriticalToChunks } = createEmotionServer(cache);

	const userAgent = ctx.req?.headers['user-agent'] ?? 'SSR';

	ctx.renderPage = async () =>
		originalRenderPage({
			enhanceApp: (App: React.ComponentType<React.ComponentProps<AppType> & AppCustomProps>) =>
				function EnhanceApp(props) {
					return <App emotionCache={cache} userAgent={userAgent} lang={lang} {...props} />;
				},
		});

	const initialProps = await Document.getInitialProps(ctx);
	// This is important. It prevents Emotion to render invalid HTML.
	// See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
	const emotionStyles = extractCriticalToChunks(initialProps.html);
	const emotionStyleTags = emotionStyles.styles.map((style) => (
		<style
			data-emotion={`${style.key} ${style.ids.join(' ')}`}
			key={style.key}
			// eslint-disable-next-line react/no-danger
			dangerouslySetInnerHTML={{ __html: style.css }}
		/>
	));

	return { ...initialProps, emotionStyleTags };
}
