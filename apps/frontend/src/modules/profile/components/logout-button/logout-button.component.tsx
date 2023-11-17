import { FC } from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CoreActionButton } from '../../../_core/components/_ui/core-table';
import { Logout } from '../../../_core/constants/icons.constants';

export interface LogoutButtonProps {
	hideLabel?: boolean;
	onLogout?(): void;
}

export const LogoutButton: FC<LogoutButtonProps> = (props) => {
	const { onLogout, hideLabel } = props;
	const { t } = useTranslation();

	return (
		<Typography variant="label" noWrap fontWeight="400" sx={{ color: (theme) => theme.colors.blue }}>
			{!hideLabel && t('profile.logout')}
			<CoreActionButton onClick={onLogout} sx={{ ml: !hideLabel ? '12px' : 0 }}>
				<Logout />
			</CoreActionButton>
		</Typography>
	);
};
