import { NextSeo } from 'next-seo';
import { LayoutType, MyPageProps, NextPageWithMeta } from '../types/route.types';
import { TFunction } from 'next-i18next';
import { RouteDefinitions } from '../../router';

export interface PathPattern<Path extends string = string> {
	/**
	 * A string to match against a URL pathname. May contain `:id`-style segments
	 * to indicate placeholders for dynamic parameters. May also end with `/*` to
	 * indicate matching the rest of the URL pathname.
	 */
	path: Path;
	/**
	 * Should be `true` if the static portions of the `path` should be matched in
	 * the same case.
	 */
	caseSensitive?: boolean;
	/**
	 * Should be `true` if this pattern should match the entire URL pathname.
	 */
	end?: boolean;
}

export const preparePathname = (pathname: string): string => {
	let result = pathname;

	if (result.startsWith('/')) {
		result = result.slice(1);
	}

	if (result.endsWith('/')) {
		result = result.slice(0, -1);
	}

	return result;
};

export const preparePattern = (pattern: string, whoreString?: boolean): string => {
	let result = pattern;

	// replace :id with [^/ ]{1,}
	// [^/ ]{1,} - matches any character except / and space, at least 1 time
	result = result.replace(/:[^/ ]{1,}/g, '[^/ ]{1,}');

	if (result.startsWith('/')) {
		result = result.slice(1);
	}

	if (result.endsWith('/')) {
		result = result.slice(0, -1);
	}

	return whoreString ? `^${result}$` : result;
};

export const matchPath = <Path extends string>(checkPattern: PathPattern<Path> | Path, pathname: string): boolean => {
	if (typeof checkPattern === 'string') {
		checkPattern = { path: checkPattern, caseSensitive: false, end: true };
	}

	const { path: pathPattern, caseSensitive, end } = checkPattern ?? { path: '/', caseSensitive: false, end: true };

	const preparedPattern = preparePattern(pathPattern, end);
	const preparedPathname = preparePathname(pathname);

	return new RegExp(preparedPattern, caseSensitive ? undefined : 'i').test(preparedPathname);
};

export const findMatches = (path: string) => RouteDefinitions.filter((route) => matchPath(route.path, path));

export const findRoute = (path: string) => RouteDefinitions.find((route) => matchPath(route.path, path));

export const getRoute = (path: string) => {
	const route = findRoute(path);

	if (!route) {
		throw new Error(`Route ${path} not found`);
	}

	return route;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const WrapPageWithMeta = (Component: NextPageWithMeta, pageProps: MyPageProps, t: TFunction) => {
	const { isBot } = pageProps ?? {};

	// If page layout is available, use it. Else return the page itself
	const Layout: LayoutType = Component.layout ?? (({ children }) => <>{children}</>);

	const seo = Component.seo?.(t, pageProps);

	if (isBot) {
		return <>{seo && <NextSeo {...seo} />}</>;
	}

	// console.log(' ');
	// console.log('page.render');

	return (
		<>
			{seo && <NextSeo {...seo} />}

			<Layout pageProps={pageProps}>
				<Component {...pageProps} />
			</Layout>
		</>
	);
};
