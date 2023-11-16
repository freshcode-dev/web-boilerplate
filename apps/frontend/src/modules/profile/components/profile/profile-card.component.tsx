import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CardContent, Typography, CardActions, Card } from '@mui/material';
import { CoreButton } from '../../../_core/components/_ui/core-button';
import { UserDto } from '@boilerplate/shared';

interface ProfileCardProps {
	profile: UserDto;
	onLogout(): void;
}

export const ProfileCard: FC<ProfileCardProps> = (props) => {
	const [t] = useTranslation();

	const { profile, onLogout } = props;

	return (
		<Card>
			<CardContent>
				<Typography variant="h5" sx={{ mb: 1 }}>
					{t('profile.title')}
				</Typography>
				<Typography gutterBottom>
					{t('profile.name')}: {profile.name}
				</Typography>
				{(profile.email) && <Typography gutterBottom>
					{t('profile.email')}: {profile.email}
				</Typography>}
				{profile.phoneNumber && <Typography gutterBottom>
					{t('profile.phone')}: {profile.phoneNumber}
				</Typography>}
			</CardContent>
			<CardActions>
				<CoreButton onClick={onLogout}>Logout</CoreButton>
			</CardActions>
		</Card>
	);
};

export default ProfileCard;
