import React, { FC } from 'react';
import { Outlet, useRoutes } from 'react-router-dom';

const UnauthorizedArea: FC = () => <Outlet />;

export default UnauthorizedArea;
