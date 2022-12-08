import { observer } from 'mobx-react-lite';
import { useSelector } from 'react-redux';

import React, { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
//import useMobxStoreHook from '../hooks/use-mobx-store.hook';
import { RootState } from '../store';
import { SessionState } from '../features';

const RequireUnauthorized = observer(({ children }: { children: JSX.Element }): ReactElement => {
  //TODO: Remove the line below
  //const { session: { isAuthenticated } } = useMobxStoreHook();
  const isLoggedIn = useSelector<RootState, boolean>((state: SessionState) => !!state.accessToken);
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
});

export default RequireUnauthorized;
