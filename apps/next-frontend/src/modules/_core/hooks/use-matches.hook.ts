import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { findMatches } from '../utils/router.client.utils';

export const useMatches = () => {
	const pathname = usePathname();

	const matches = useMemo(() => findMatches(pathname), [pathname]);

	return matches;
};
