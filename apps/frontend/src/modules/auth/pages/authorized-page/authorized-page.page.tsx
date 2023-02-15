import { useGetUsersQuery } from '../../../../store/api/users.api';
import React, { FC } from 'react';
import { CoreButton, CoreCheckbox, CoreTextField, CoreSelect } from '../../../_core/components/_ui';
import { useAppDispatch } from '../../../../store';
import { signOutAction } from '../../store/actions/sign-out.action';

export const AuthorizedPage: FC = () => {
  const dispatch = useAppDispatch();

  const handleLogoutClick = async () => {
    await dispatch(signOutAction());
  };

  // Using a query hook automatically fetches data and returns query values
  const { data } = useGetUsersQuery();

  return (
    <div>
      authorized page content
      <br />
      {JSON.stringify(data)}
      <br />
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
