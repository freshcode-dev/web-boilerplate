import { FC } from 'react';
import { SessionDto } from '@boilerplate/shared';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export interface SessionCardProps {
	session?: SessionDto;
}

export const SessionCard: FC<SessionCardProps> = ({ session }) => {
	const [t] = useTranslation();

	const { ipAddressText, userAgentText, createdAt, updatedAt } = session ?? {};

	return (
		<Box>
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
		</Box>
	);
};
