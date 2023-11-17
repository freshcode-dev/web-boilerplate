import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Avatar, Typography } from '@mui/material';
import { CoreHeaderButton } from '../_ui/core-header-button';
import { useGetProfileQuery } from '../../../../store/api/auth.api';
import { ProfileRoutes } from '../../../profile/constants';

const ProfileButton = () => {
	const navigate = useNavigate();

	const [t] = useTranslation();
	const { data: profile } = useGetProfileQuery();

	const handleNavigate = useCallback(() => {
		navigate(ProfileRoutes.Profile);
	}, [navigate]);

	return (
		<CoreHeaderButton onClick={handleNavigate} sx={{ width: 184 }}>
			<Avatar src={(profile as { avatarSrc?: string })?.avatarSrc}>{profile?.name[0].toUpperCase()}</Avatar>
			<Typography variant="body1" noWrap sx={{ ml: 1.5 }}>
				{t('profile.my-profile')}
			</Typography>
		</CoreHeaderButton>
	);
};

export default ProfileButton;
