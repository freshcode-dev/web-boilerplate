import { useCallback, useRef } from 'react';

interface ScrollFetcherOptions {
	threshold: number;
	itemsCount: number;
	fetchMore?(count: number): void;
}

export const useScrollFetcher = (props: ScrollFetcherOptions) => {
	const { fetchMore, threshold, itemsCount } = props;

	const containerRef = useRef<HTMLDivElement | null>(null);

	const onScroll = useCallback(() => {
		if (!fetchMore || !containerRef.current) {
			return;
		}

		const { scrollHeight, scrollTop, clientHeight } = containerRef.current;
		const offset = scrollHeight - scrollTop - clientHeight;

		if (offset < threshold) {
			fetchMore(itemsCount);
		}
	}, [fetchMore, itemsCount, threshold]);

	return {
		containerRef,
		onScroll
	};
};
