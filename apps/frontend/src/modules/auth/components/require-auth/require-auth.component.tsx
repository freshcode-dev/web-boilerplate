import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useCurrentAccessTokenSelector } from "../../store/session.slice";
import { AuthRoutes } from '../../constants';

export const RequireAuth = ({ children }: { children: JSX.Element }): ReactElement => {
	const currentToken = useCurrentAccessTokenSelector();

	if (!currentToken) {
		return <Navigate to={AuthRoutes.LoginEmail} replace />;
	}

	return children;
};
