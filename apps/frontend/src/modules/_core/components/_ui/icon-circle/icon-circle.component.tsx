import React, { FC, ReactNode } from "react";
import { Box } from "@mui/material";

interface IconCircleProps {
	danger?: boolean;
	children?: ReactNode;
}

export const IconCircle: FC<IconCircleProps> = (props) => {
	const { danger, children } = props;

	return (
		<Box
			sx={[
				{
					width: 80,
					height: 80,
					display: 'flex',
					alignItems: 'center',
					color: theme => theme.colors.white,
					justifyContent: 'center',
					borderRadius: '40px',
					backgroundColor: ({ colors }) => (
						!danger
							? colors.blue
							: colors.red)
				},
				({ breakpoints }) => ({
					[breakpoints.down('sm')]: {
						width: 60,
						height: 60,
						borderRadius: '30px'
					}
				})
			]}
		>
			{children}
		</Box>
	);
};
