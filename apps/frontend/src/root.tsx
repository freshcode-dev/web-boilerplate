import React, { FC, Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import RouterSuspense from './components/router-suspense';
import NotFoundPage from './pages/not-found';
import RequireAuth from './components/require-auth';
import { observer } from 'mobx-react-lite';
import RequireUnauthorized from './components/require-unauthorized';
import AuthorisedPage from './pages/authorised-page';

const AuthorizedArea = React.lazy(async () => import("./areas/authorized-area"));
const UnauthorizedArea = React.lazy(async () => import("./areas/unauthorized"));
const LoginPage = React.lazy(async () => import("./pages/login"));
const SignUpPage = React.lazy(async () => import("./pages/signup"));

const Root: FC = observer(() => {
  const routes = useRoutes([
    {
      path: '/',
      element: <RequireAuth><AuthorizedArea /></RequireAuth>,
      children: [
        { index: true, element: <AuthorisedPage /> }
      ]
    },
    {
      element: <RequireUnauthorized><UnauthorizedArea /></RequireUnauthorized>,
      children: [
        { path: '/login', element: <LoginPage /> },
        { path: '/signup', element: <SignUpPage /> },
      ]
    },
    { path: '*', element: <NotFoundPage /> }
  ]);

  return (
    <Suspense fallback={<RouterSuspense />}>
      {routes}
    </Suspense>
  );
})

export default Root;
