import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../../../store';

export const RequireUnauthorized = ({ children }: { children: JSX.Element }): ReactElement => {
  const isLoggedIn = useAppSelector(state => state.session.accessToken);

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};
