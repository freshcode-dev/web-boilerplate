import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { PathPattern, matchPath } from '../utils/router.client.utils';

export interface Match<Path extends string = string> {
	isMatch: boolean;
	pathname: Path;
}

export const useMatch = <Path extends string = string>(pattern: PathPattern<Path> | Path): Match<Path> | null => {
	const pathname = usePathname() as Path;

	const isMatch = useMemo(() => matchPath(pattern, pathname), [pathname, pattern]);

	const match = useMemo(() => (isMatch ? { isMatch, pathname } : null), [isMatch, pathname]);

	return match;
};
