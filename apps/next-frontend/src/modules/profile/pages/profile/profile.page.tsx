import React from 'react';
import { Box } from '@mui/material';
import { ProfileCard } from '../../components/profile';
import { ProfileNavigation } from '../../components/profile-nav';
import { contentWrapperStyles } from './profile-page.styles';
import { NextPageWithMeta, PageDefinition } from '@/modules/_core/types';
import UnauthorizedArea from '@/modules/_core/areas/unauthorized-area/unauthorized-area.component';
import { LOGIN_PAGE_DESCRIPTION, LOGIN_PAGE_TITLE, NamespacesEnum } from '@/constants';
import { useGetProfileQuery } from '@/store/api/auth.api';
import AuthorizedArea from '@/modules/_core/areas/authorized-area/authorized-area.component';

export const ProfilePage: NextPageWithMeta = () => {
	const { data: profile } = useGetProfileQuery();

	return (
		<Box>
			<ProfileNavigation />

			<Box sx={contentWrapperStyles}>{profile && <ProfileCard profile={profile} />}</Box>
		</Box>
	);
};

ProfilePage.layout = AuthorizedArea;

ProfilePage.seo = (t) => ({
	title: LOGIN_PAGE_TITLE(t),
	description: LOGIN_PAGE_DESCRIPTION(t),
});

export const ProfilePageDefinition: PageDefinition = {
	namespaces: [NamespacesEnum.SignIn],
	requiresAuth: true
};
