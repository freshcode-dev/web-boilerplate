import React, { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CardContent, Typography, Card, Box } from '@mui/material';
import { UserDto } from '@boilerplate/shared';
import { CoreButton } from '../../../_core/components/_ui/core-button';
import { useCustomGoogleAuthButton, GoogleAuthButton } from '../../../auth';
import {
	contactInfoButtonStyles,
	contactInfoRowStyles,
	subtitleStyles,
	profileDataCategoryStyles,
	cardStyles,
} from './profile-card.styles';
import { useMuiModal } from '../../../_core/hooks';
import { EditUserDataModal, EditUserDataModalProps } from './modals/edit-user-data-modal.component';
import { EditPhoneModal, EditPhoneModalProps } from './modals/edit-phone-modal.component';
import { EditEmailModal, EditEmailModalProps } from './modals/edit-email-modal.component';
import { isGoogleAuthEnabled } from '../../../../constants';

interface ProfileCardProps {
	profile: UserDto;
}

export const ProfileCard: FC<ProfileCardProps> = (props) => {
	const { profile } = props;

	const [t] = useTranslation();

	const { handleGoogleButtonClick, setGoogleButtonRef } = useCustomGoogleAuthButton();

	const { openModal: openEditUserDataModal } = useMuiModal<EditUserDataModalProps>(EditUserDataModal);
	const { openModal: openEditEmailModal } = useMuiModal<EditEmailModalProps>(EditEmailModal);
	const { openModal: openEditPhoneModal } = useMuiModal<EditPhoneModalProps>(EditPhoneModal);

	const handleOpenEditUserDataModal = useCallback(() => {
		openEditUserDataModal({
			data: profile,
		});
	}, [openEditUserDataModal, profile]);

	const handleOpenEditEmailModal = useCallback(() => {
		openEditEmailModal({
			email: profile.email,
		});
	}, [openEditEmailModal, profile.email]);

	const handleOpenEditPhoneModal = useCallback(() => {
		openEditPhoneModal({
			phoneNumber: profile.phoneNumber,
		});
	}, [openEditPhoneModal, profile.phoneNumber]);

	return (
		<Card sx={cardStyles}>
			<CardContent>
				<Typography variant="h5" sx={{ mb: 1 }}>
					{t('profile.title')}
				</Typography>

				<Box sx={profileDataCategoryStyles}>
					<Typography variant="h6" sx={subtitleStyles}>
						{t('profile.user-data')}:
					</Typography>

					<Typography gutterBottom>
						{t('profile.name')}: {profile.name}
					</Typography>

					<CoreButton sx={contactInfoButtonStyles} onClick={handleOpenEditUserDataModal}>
						{t('profile.edit')}
					</CoreButton>
				</Box>

				<Box sx={profileDataCategoryStyles}>
					<Typography variant="h6" sx={subtitleStyles}>
						{t('profile.contact-info')}:
					</Typography>

					<Box sx={contactInfoRowStyles}>
						<Typography>
							{t('profile.email')}: {profile.email}
						</Typography>
						<CoreButton sx={contactInfoButtonStyles} onClick={handleOpenEditEmailModal}>
							{t('profile.edit')}
						</CoreButton>
					</Box>
					<Box sx={contactInfoRowStyles}>
						<Typography>
							{t('profile.phone')}: {profile.phoneNumber}
						</Typography>
						<CoreButton sx={contactInfoButtonStyles} onClick={handleOpenEditPhoneModal}>
							{t('profile.edit')}
						</CoreButton>
					</Box>
					<Box sx={contactInfoRowStyles}>
						<Typography>
							{t('profile.google-account')}: {profile.googleEmail ?? t('profile.google-account-not-connected')}
						</Typography>
						{!profile.googleEmail && isGoogleAuthEnabled && (
							<>
								<CoreButton sx={contactInfoButtonStyles} onClick={handleGoogleButtonClick}>
									{t('profile.google-auth')}
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
