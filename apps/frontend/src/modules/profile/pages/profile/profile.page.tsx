import React, { FC, useCallback } from 'react';
import { Box } from '@mui/material';
import ProfileCard from '../../components/profile/profile-card.component';
import { useAppDispatch } from '../../../../store';
import { signOutAction } from '../../../auth';
import { useGetProfileQuery } from '../../../../store/api/auth.api';
import { ProfileNavigation } from '../../components/profile-nav';
import { contentWrapperStyles } from './profile-page.styles';

export const ProfilePage: FC = () => {
	const { data: profile } = useGetProfileQuery();

	const dispatch = useAppDispatch();

	const handleLogout = useCallback(() => {
		dispatch(signOutAction());
	}, [dispatch]);

	return (
		<Box>
			<ProfileNavigation />

			<Box sx={contentWrapperStyles}>{profile && <ProfileCard profile={profile} onLogout={handleLogout} />}</Box>
		</Box>
	);
};
