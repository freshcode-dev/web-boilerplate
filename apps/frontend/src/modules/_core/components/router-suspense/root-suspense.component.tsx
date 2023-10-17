import React, { FC, ReactNode, Suspense } from "react";
import SuspenseSpinner from "./suspense-spinner.component";
import { Box } from "@mui/material";

interface RootSuspenseProps {
	children: ReactNode;
}

const RootSuspense: FC<RootSuspenseProps> = (props) => {
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
};

export default RootSuspense;
