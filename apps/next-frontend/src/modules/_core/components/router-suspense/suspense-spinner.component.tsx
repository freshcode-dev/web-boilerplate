import React, { FC } from 'react';
import { Box, CircularProgress } from '@mui/material';

interface SuspenseSpinnerProps {
	full?: boolean;
}

export const SuspenseSpinner: FC<SuspenseSpinnerProps> = (props) => {
	const { full } = props;

	return (
		<Box
			sx={{
				display: "flex",
				height: full ? '100%' : 'auto',
				width: full ? '100%' : 'auto',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
			<CircularProgress />
		</Box>
	);
};
