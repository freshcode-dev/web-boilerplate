import { observer } from 'mobx-react-lite';
import React, { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { sessionStore } from '../../stores';

const RequireAuth = observer(({ children }: { children: JSX.Element }): ReactElement => {
  const { isAuthenticated } = sessionStore;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
});

export default RequireAuth;
