import { observer } from 'mobx-react-lite';
import React, { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import useMobxStoreHook from '../hooks/use-mobx-store.hook';

const RequireUnauthorized = observer(({ children }: { children: JSX.Element }): ReactElement => {
  const { session: { isAuthenticated } } = useMobxStoreHook();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
});

export default RequireUnauthorized;
