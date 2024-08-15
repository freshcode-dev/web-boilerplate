import { ReactElement } from 'react';
import { useCurrentAccessTokenSelector, useCurrentRefreshTokenSelector } from '../../store/session.slice';
import { IS_BROWSER } from '@/constants';
import { useGetCurrentSessionQuery } from '@/store/api/sessions.api';
import { ReloadPage } from '@/modules/_core/components/reload-page';

export const RequireAuthorized = ({ children }: { children: JSX.Element }): ReactElement => {
	const currentToken = useCurrentAccessTokenSelector();

	// TODO: check if this logic is correct - check if user session is expired
	const refreshToken = useCurrentRefreshTokenSelector();

	useGetCurrentSessionQuery({
		refreshToken: refreshToken?.token as string,
	});

	if (!currentToken && IS_BROWSER) {
		return <ReloadPage />;
	}

	return children;
};
