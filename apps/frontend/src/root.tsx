import React, { FC, Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import NotFoundPage from './pages/not-found';
import AuthorisedPage from './pages/authorised-page';
import RequireAuth from './components/require-auth.component';
import RequireUnauthorized from './components/require-unauthorized.component';
import RouterSuspense from './components/router-suspense.component';

const AuthorizedArea = React.lazy(async () => import("./areas/authorized-area.component"));
const UnauthorizedArea = React.lazy(async () => import("./areas/unauthorized-area.component"));
const LoginPage = React.lazy(async () => import("./pages/login"));
const SignUpPage = React.lazy(async () => import("./pages/signup"));
const StylesExamplesPage = React.lazy(async () => import("./pages/styles-examples/styles-examples.page"));

const Root: FC = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <RequireAuth><AuthorizedArea /></RequireAuth>,
      children: [
        { index: true, element: <AuthorisedPage /> }
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
}

export default Root;
