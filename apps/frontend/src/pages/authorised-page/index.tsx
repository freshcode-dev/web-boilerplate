import { Button } from '@mui/material';
import React, { FC } from 'react';
import { sessionStore } from '../../stores';

const AuthorizedPage: FC = () => {
  const { logOut } = sessionStore;

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
