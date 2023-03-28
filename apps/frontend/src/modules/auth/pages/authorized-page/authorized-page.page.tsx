import React, { FC, useCallback } from 'react';
import { useGetProfileQuery } from '../../../../store/api/users.api';
import { Container } from "@mui/material";
import ProfileCard from "../../components/profile/profile-card.component";
import { useAppDispatch } from "../../../../store";
import { signOutAction } from "../../store/actions/sign-out.action";

export const AuthorizedPage: FC = () => {
  const { data } = useGetProfileQuery();
	const dispatch = useAppDispatch();

	const handleLogout = useCallback(() => {
		dispatch(signOutAction());
	}, [dispatch]);

  return (
		<Container component="main" maxWidth="xs">
			{data && (
				<ProfileCard
					name={data.name}
					email={data.email}
					onLogout={handleLogout}
				/>
			)}
		</Container>
  );
};

export default AuthorizedPage;
