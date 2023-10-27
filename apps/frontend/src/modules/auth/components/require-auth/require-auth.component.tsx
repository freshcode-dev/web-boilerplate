import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useCurrentAccessTokenSelector } from '../../store/session.slice';

export const RequireAuth = ({ children }: { children: JSX.Element }): ReactElement => {
	const currentToken = useCurrentAccessTokenSelector();

	if (!currentToken) {
		return <Navigate to="/auth/login" replace/>;
	}

	return children;
};
