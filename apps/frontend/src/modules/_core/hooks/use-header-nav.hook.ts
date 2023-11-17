import { useMemo } from 'react';
import { NavHandle } from '../interfaces/nav-handle.interface';
import { useMatches } from 'react-router-dom';

export const useHeaderNav = (): NavHandle | undefined => {
	const matches = useMatches();

	return useMemo(() => {
		const navHandle = matches.find(({ handle }) => !!(handle as NavHandle)?.to);

		if (!navHandle) {
			return;
		}

		return navHandle.handle as NavHandle;
	}, [matches]);
};
