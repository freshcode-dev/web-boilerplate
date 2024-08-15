import React, { FC } from 'react';
import { CoreBackButton } from '../core-back-button';
import { Typography } from '@mui/material';

interface CoreHeaderWithBackButtonProps {
	header?: string | null;
	hideBackButton?: boolean;
	onBack?(): void;
}

export const CoreHeaderWithBackButton: FC<CoreHeaderWithBackButtonProps> = (props) => {
	const { header, onBack, hideBackButton } = props;

	return (
		<>
			{!hideBackButton && <CoreBackButton onClick={onBack} />}
			<Typography
				variant="h4"
				sx={{
					ml: !hideBackButton ? 2 : 0,
					flex: 1,
				}}
				noWrap
			>
				{header}
			</Typography>
		</>
	);
};
