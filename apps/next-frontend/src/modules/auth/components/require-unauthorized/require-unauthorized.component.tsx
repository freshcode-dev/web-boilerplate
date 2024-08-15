import { ReactElement } from 'react';
import { useCurrentAccessTokenSelector } from '../../store/session.slice';
import { IS_BROWSER } from '@/constants';
import { ReloadPage } from '@/modules/_core/components/reload-page';

export const RequireUnauthorized = ({ children }: { children: JSX.Element }): ReactElement => {
	const currentToken = useCurrentAccessTokenSelector();

	if (currentToken && IS_BROWSER) {
		return <ReloadPage />;
	}

	return children;
};
