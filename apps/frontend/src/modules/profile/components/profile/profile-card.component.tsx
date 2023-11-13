import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CardContent, Typography, CardActions, Card, Box } from '@mui/material';
import { UserDto } from '@boilerplate/shared';
import { CoreButton } from '../../../_core/components/_ui/core-button';
import { useCustomGoogleAuthButton, GoogleAuthButton } from '../../../auth';
import { googleAuthButtonStyles, googleAuthRowStyles } from './profile-card.styles';

interface ProfileCardProps {
	profile: UserDto;
	onLogout(): void;
}

export const ProfileCard: FC<ProfileCardProps> = (props) => {
	const { profile, onLogout } = props;

	const [t] = useTranslation();

	const { handleGoogleButtonClick, setGoogleButtonRef } = useCustomGoogleAuthButton();

	return (
		<Card>
			<CardContent>
				<Typography variant="h5" sx={{ mb: 1 }}>
					{t('profile.title')}
				</Typography>
				<Typography gutterBottom>
					{t('profile.name')}: {profile.name}
				</Typography>
				{profile.email && (
					<Typography gutterBottom>
						{t('profile.email')}: {profile.email}
					</Typography>
				)}
				{profile.phoneNumber && (
					<Typography gutterBottom>
						{t('profile.phone')}: {profile.phoneNumber}
					</Typography>
				)}
				<Box sx={googleAuthRowStyles}>
					<Typography>
						{t('profile.googleAccount')}: {profile.googleEmail ?? t('profile.googleAccountNotConnected')}
					</Typography>
					{!profile.googleEmail && (
						<>
							<CoreButton sx={googleAuthButtonStyles} onClick={handleGoogleButtonClick}>
								{t('profile.googleAuth')}
							</CoreButton>
							<GoogleAuthButton show={false} setButtonRef={setGoogleButtonRef} />
						</>
					)}
				</Box>
			</CardContent>
			<CardActions>
				<CoreButton onClick={onLogout}>{t('profile.logout')}</CoreButton>
			</CardActions>
		</Card>
	);
};
