import React, { FC, useCallback } from 'react';
import { CardContent, Typography, Card, Box } from '@mui/material';
import { UserDto } from '@boilerplate/shared';
import { CoreButton } from '../../../_core/components/_ui/core-button';
import {
	contactInfoButtonStyles,
	contactInfoRowStyles,
	subtitleStyles,
	profileDataCategoryStyles,
	cardStyles,
} from './profile-card.styles';
import { useMuiModal } from '../../../_core/hooks';
import { useTranslation } from 'next-i18next';
import { GoogleAuthButton } from '@/modules/auth/components/google-auth-button';
import { useCustomGoogleAuthButton } from '@/modules/auth';
import { EditUserDataModal } from './modals/edit-user-data-modal.component';
import { EditPhoneModal } from './modals/edit-phone-modal.component';
import { IS_GOOGLE_AUTH_ENABLED, NamespacesEnum } from '@/constants';

interface ProfileCardProps {
	profile: UserDto;
}

export const ProfileCard: FC<ProfileCardProps> = (props) => {
	const { profile } = props;

	const [t] = useTranslation([NamespacesEnum.Profile]);

	const { handleGoogleButtonClick, setGoogleButtonRef } = useCustomGoogleAuthButton();

	const { openModal: openEditUserDataModal } = useMuiModal(EditUserDataModal);
	const { openModal: openEditPhoneModal } = useMuiModal(EditPhoneModal);

	const handleOpenEditUserDataModal = useCallback(() => {
		openEditUserDataModal({
			data: profile,
		});
	}, [openEditUserDataModal, profile]);

	const handleOpenEditPhoneModal = useCallback(() => {
		openEditPhoneModal({
			phoneNumber: profile.phoneNumber,
		});
	}, [openEditPhoneModal, profile.phoneNumber]);

	return (
		<Card sx={cardStyles}>
			<CardContent>
				<Typography variant="h5" sx={{ mb: 1 }}>
					{t('title')}
				</Typography>

				<Box sx={profileDataCategoryStyles}>
					<Typography variant="h6" sx={subtitleStyles}>
						{t('user-data')}:
					</Typography>

					<Typography gutterBottom>
						{t('name')}: {profile.name}
					</Typography>

					<CoreButton sx={contactInfoButtonStyles} onClick={handleOpenEditUserDataModal}>
						{t('edit')}
					</CoreButton>
				</Box>

				<Box sx={profileDataCategoryStyles}>
					<Typography variant="h6" sx={subtitleStyles}>
						{t('contact-info')}:
					</Typography>

					<Box sx={contactInfoRowStyles}>
						<Typography>
							{t('phone')}: {profile.phoneNumber}
						</Typography>
						<CoreButton sx={contactInfoButtonStyles} onClick={handleOpenEditPhoneModal}>
							{t('edit')}
						</CoreButton>
					</Box>
					<Box sx={contactInfoRowStyles}>
						<Typography>
							{t('google-account')}: {profile.googleEmail ?? t('google-account-not-connected')}
						</Typography>
						{!profile.googleEmail && IS_GOOGLE_AUTH_ENABLED && (
							<>
								<CoreButton sx={contactInfoButtonStyles} onClick={handleGoogleButtonClick}>
									{t('google-auth')}
								</CoreButton>
								<GoogleAuthButton show={false} setButtonRef={setGoogleButtonRef} />
							</>
						)}
					</Box>
				</Box>
			</CardContent>
		</Card>
	);
};
