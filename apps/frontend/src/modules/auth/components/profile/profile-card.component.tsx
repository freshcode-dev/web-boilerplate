import React, { FC } from 'react';
import { CardContent, Typography, CardActions, Card } from '@mui/material';
import { CoreButton } from '../../../_core/components/_ui/core-button';

interface ProfileCardProps {
	name: string;
	email: string;
	onLogout(): void;
}

export const ProfileCard: FC<ProfileCardProps> = (props) => {
	const { name, email, onLogout } = props;

	return (
		<Card>
			<CardContent>
				<Typography variant="h5" sx={{ mb: 1 }}>Profile</Typography>
				<Typography gutterBottom>
					Name: {name}
				</Typography>
				<Typography gutterBottom>
					Email: {email}
				</Typography>
			</CardContent>
			<CardActions>
				<CoreButton onClick={onLogout}>Logout</CoreButton>
			</CardActions>
		</Card>
	);
};

export default ProfileCard;
