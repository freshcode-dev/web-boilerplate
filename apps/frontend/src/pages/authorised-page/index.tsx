import React, { FC } from 'react';
import { CoreButton, CoreCheckbox, CoreTextField, CoreSelect } from '../../components/_ui';
import { logOut } from '../../store/features/session';
import { useAppDispatch } from '../../store';
import { useGetUsersQuery } from '../../store/features/users'

const AuthorizedPage: FC = () => {
  const dispatch = useAppDispatch();
  const handleLogoutClick = async () => {
    dispatch(logOut())
  }
  // Using a query hook automatically fetches data and returns query values
  const { data, error, isLoading } = useGetUsersQuery('');
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
