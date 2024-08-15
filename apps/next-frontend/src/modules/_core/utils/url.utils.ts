import { IS_BROWSER } from '@/constants';

export const makeUrl = ({
	base,
	pathname,
	query,
}: {
	base?: string | URL | undefined;
	pathname?: string;
	query?: string | URLSearchParams | undefined;
}) => {
	if (!pathname) return null;

	const url = new URL(pathname, base);

	if (query) {
		url.search = typeof query === 'string' ? query : query.toString();
	}

	return url;
};

export const makePathWithQuery = ({ pathname, query }: { pathname?: string; query?: string | URLSearchParams | undefined }) => {
	if (!pathname) return null;

	const url = makeUrl({
		pathname,
		query,
		base: 'http://localhost', // dummy base
	});

	return url?.pathname ?? null;
};

export const parseUrl = (url?: string, base?: string | URL | undefined) => {
	if (!url) return null;

	try {
		return new URL(url, base);
	} catch (error) {
		return null;
	}
};

export const parseSearchParamsFromUrl = (url?: string) => {
	const parsedUrl = parseUrl(url);

	return parsedUrl ? parsedUrl.searchParams : null;
};

export const getSearchParams = (search?: string) => {
	if (!search && IS_BROWSER) {
		search = window.location.search;
	}

	if (search) {
		return new URLSearchParams(search);
	}

	return null;
};

export const reloadPage = () => {
	IS_BROWSER && window.location.reload();
};
