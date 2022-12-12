import React, { FC } from 'react';
import { CoreButton, CoreCheckbox, CoreTextField, CoreSelect } from '../../components/_ui';
import { logOut } from '../../features';
import { useAppDispatch } from '../../store';

const AuthorizedPage: FC = () => {
  const dispatch = useAppDispatch();
  const handleLogoutClick = async () => {
    dispatch(logOut())
  }

  return (
    <div>
      authorized page content
      <br/>
      <CoreButton onClick={handleLogoutClick}>Logout</CoreButton>
      <CoreCheckbox></CoreCheckbox>
      <CoreSelect
        variant="outlined"
        size="small"
        sx={{
          width: 200
        }}
      >
      </CoreSelect>
      
      <CoreTextField size="small"></CoreTextField>
    </div>
  )
};

export default AuthorizedPage;
