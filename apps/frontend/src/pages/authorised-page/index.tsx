import { Button } from '@mui/material';
import React, { FC } from 'react';
import useMobxStoreHook from '../../hooks/use-mobx-store.hook';

const AuthorizedPage: FC = () => {
  const { session: { logOut } } = useMobxStoreHook();

  const handleLogoutClick = async () => {
    await logOut();
  }

  return (
    <div>
      authorized page content
      <Button onClick={handleLogoutClick}>Logout</Button>
    </div>
  )
};

export default AuthorizedPage;
