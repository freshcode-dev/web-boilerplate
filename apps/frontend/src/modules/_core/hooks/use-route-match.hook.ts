import { useLocation, matchPath } from "react-router-dom";
import { useMemo } from 'react';

export const useRouteMatch = (patterns: string[]) => {
	const { pathname } = useLocation();

	return useMemo(() => {
		for (const pattern of patterns) {
			const possibleMatch = matchPath(pattern, pathname);

			if (possibleMatch !== null) {
				return possibleMatch;
			}
		}

		return null;
	}, [pathname, patterns]);
};
