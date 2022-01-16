import React, { FC, Suspense } from 'react';
import { Outlet, useRoutes } from 'react-router-dom';
import AuthorisedPage from '../../pages/authorised-page';
import RouterSuspense from '../../components/router-suspense';

const AuthorizedArea: FC = () => <Outlet />

export default AuthorizedArea;
