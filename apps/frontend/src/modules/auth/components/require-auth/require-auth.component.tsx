import { ReactElement, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useCurrentAccessTokenSelector } from "../../store/session.slice";

export const RequireAuth = ({ children }: { children: JSX.Element }): ReactElement => {
  const currentToken = useCurrentAccessTokenSelector();

	useEffect(() => {
		console.info('isLoggedIn change', currentToken);
	}, [currentToken]);

  if (!currentToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
