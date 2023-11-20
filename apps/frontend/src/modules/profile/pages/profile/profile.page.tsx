import React, { FC } from 'react';
import { Box } from '@mui/material';
import { ProfileCard } from '../../components/profile';
import { useGetProfileQuery } from '../../../../store/api/auth.api';
import { ProfileNavigation } from '../../components/profile-nav';
import { contentWrapperStyles } from './profile-page.styles';

export const ProfilePage: FC = () => {
	const { data: profile } = useGetProfileQuery();

	return (
		<Box>
			<ProfileNavigation />

			<Box sx={contentWrapperStyles}>{profile && <ProfileCard profile={profile} />}</Box>
		</Box>
	);
};
