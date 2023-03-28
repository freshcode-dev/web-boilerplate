import React, { FC, Suspense, lazy } from 'react';
import { useRoutes } from 'react-router-dom';
import { NotFoundPage } from './modules/_core';
import { RequireAuth, RequireUnauthorized, AuthorizedPage } from './modules/auth';
import RouterSuspense from './modules/_core/components/router-suspense/router-suspense.component';
import { useAuthSubscription } from "./modules/auth/hooks/use-auth-subscription.hook";

const AuthorizedArea = lazy(async () => import('./modules/_core/areas/authorized-area.component'));
const UnauthorizedArea = lazy(async () => import('./modules/_core/areas/unauthorized-area.component'));
const LoginPage = lazy(async () => import('./modules/auth/pages/login/login.page'));
const SignUpPage = lazy(async () => import('./modules/auth/pages/signup/signup.page'));
const StylesExamplesPage = lazy(async () => import('./modules/styles-examples/pages/styles-examples/styles-examples.page'));

const Root: FC = () => {
	useAuthSubscription();

  const routes = useRoutes([
    {
      path: '/',
      element: <RequireAuth><AuthorizedArea /></RequireAuth>,
      children: [
        { index: true, element: <AuthorizedPage /> }
      ]
    },
    {
      path: '/styles-examples',
      element: <StylesExamplesPage />,
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
};

export default Root;
