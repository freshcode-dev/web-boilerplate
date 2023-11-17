import { SystemHeaderType } from '../constants/system-header-type.constants';
import { useMatches } from 'react-router-dom';
import { useMemo } from 'react';
import { HeaderTypeHandle } from '../interfaces/header-type-handle.interface';

export const useHeaderType = (): SystemHeaderType => {
	const matches = useMatches();

	return useMemo(() => {
		const matchWithType = matches.find(({ handle }) => !!(handle as HeaderTypeHandle)?.headerType);

		if (!matchWithType) {
			return SystemHeaderType.Default;
		}

		const handle = matchWithType.handle as HeaderTypeHandle;

		return handle.headerType;
	}, [matches]);
};
