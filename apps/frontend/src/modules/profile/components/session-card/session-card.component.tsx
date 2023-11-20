import { FC } from 'react';
import { SessionDto } from '@boilerplate/shared';
import { Card, CardActions, CardContent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CoreButton } from '../../../_core/components/_ui/core-button';
import { cardStyles, subtitleStyles } from '../profile/profile-card.styles';

export interface SessionCardProps {
	session?: SessionDto;
	isInterruptOtherSessionsLoading: boolean;
	disableInterruptOtherSessions: boolean;
	interruptOtherSessions(): Promise<void>;
	openChangePasswordModal(): void;
}

export const SessionCard: FC<SessionCardProps> = (props) => {
	const {
		session,
		openChangePasswordModal,
		interruptOtherSessions,
		isInterruptOtherSessionsLoading,
		disableInterruptOtherSessions,
	} = props;

	const [t] = useTranslation();

	const { ipAddressText, userAgentText, createdAt, updatedAt } = session ?? {};

	return (
		<Card sx={cardStyles}>
			<CardContent>
				<Typography variant="h5" sx={subtitleStyles}>{t('profile.sessions.current-session')}</Typography>

				<Typography variant="body1">
					{t('profile.sessions.table.columns.ipAddress')}: {ipAddressText}
				</Typography>
				<Typography variant="body1">
					{t('profile.sessions.table.columns.userAgent')}: {userAgentText}
				</Typography>
				<Typography variant="body1">
					{t('profile.sessions.table.columns.createdAt')}: {createdAt ? new Date(createdAt).toLocaleString() : ''}
				</Typography>
				<Typography variant="body1">
					{t('profile.sessions.table.columns.updatedAt')}: {updatedAt ? new Date(updatedAt).toLocaleString() : ''}
				</Typography>
			</CardContent>
			<CardActions>
				<CoreButton
					loading={isInterruptOtherSessionsLoading}
					onClick={interruptOtherSessions}
					disabled={disableInterruptOtherSessions}
				>
					{t('profile.sessions.sign-out-all-sessions')}
				</CoreButton>

				<CoreButton onClick={openChangePasswordModal}>{t('profile.change-password-ph')}</CoreButton>
			</CardActions>
		</Card>
	);
};
