import { useGetProfileQuery } from '../../../../store/api/users.api';
import React, { FC } from 'react';
import { CoreButton, CoreCheckbox, CoreTextField, CoreSelect } from '../../../_core/components/_ui';

export const AuthorizedPage: FC = () => {
  const { data } = useGetProfileQuery();

  return (
    <div>
      authorized page content
      <br />
      {JSON.stringify(data)}
      <br />
      <CoreButton>Logout</CoreButton>
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
  );
};

export default AuthorizedPage;
