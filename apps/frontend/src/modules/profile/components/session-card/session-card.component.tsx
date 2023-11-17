import { FC } from 'react';
import { SessionDto } from '@boilerplate/shared';
import { Card, CardActions, CardContent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CoreButton } from '../../../_core/components/_ui/core-button';

export interface SessionCardProps {
	session?: SessionDto;
	isInterruptOtherSessionsLoading: boolean;
	handleInterruptOtherSessions(): void;
}

export const SessionCard: FC<SessionCardProps> = (props) => {
	const { session, isInterruptOtherSessionsLoading, handleInterruptOtherSessions } = props;

	const [t] = useTranslation();

	const { ipAddressText, userAgentText, createdAt, updatedAt } = session ?? {};

	return (
		<Card sx={{ mb: 3 }}>
			<CardContent>
				<Typography variant="h5">Current session</Typography>

				<hr />

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
				<CoreButton loading={isInterruptOtherSessionsLoading} onClick={handleInterruptOtherSessions}>
					{t('profile.sessions.signOutAllSessions')}
				</CoreButton>
			</CardActions>
		</Card>
	);
};
