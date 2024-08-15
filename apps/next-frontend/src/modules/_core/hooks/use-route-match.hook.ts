import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Match } from './use-match.hook';
import { matchPath } from '../utils/router.client.utils';

export const useRouteMatch = <Path extends string = string>(patterns: string[]): Match<Path> | null => {
	const pathname = usePathname() as Path;

	return useMemo(() => {
		for (const pattern of patterns) {
			const isMatch = matchPath(pattern, pathname);

			if (isMatch) {
				return { isMatch, pathname };
			}
		}

		return null;
	}, [pathname, patterns]);
};
