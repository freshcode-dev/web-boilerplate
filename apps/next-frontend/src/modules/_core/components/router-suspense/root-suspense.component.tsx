import React, { FC, ReactNode, Suspense, memo } from 'react';
import { SuspenseSpinner } from './suspense-spinner.component';
import { Box } from '@mui/material';

interface RootSuspenseProps {
	children: ReactNode;
}

export const RootSuspense: FC<RootSuspenseProps> = memo((props) => {
	const { children } = props;

	return (
		<Suspense
			fallback={
				<Box sx={{ width: '100%', height: '100%' }}>
					<SuspenseSpinner full />
				</Box>
			}
		>
			{children}
		</Suspense>
	);
});

RootSuspense.displayName = 'RootSuspense';
