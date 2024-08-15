import React, { FC, ReactNode } from "react";
import { Box, SxProps, Theme, Typography } from "@mui/material";

interface CoreTableEmptyBodyProps {
	icon?: ReactNode;
	label?: string | null;
	description?: string | null;
	descriptionSx?: SxProps<Theme>;
}

export const CoreTableEmptyBody: FC<CoreTableEmptyBodyProps> = (props) => {
	const { label, description, icon, descriptionSx } = props;

	return (
		<Box
			sx={{
				p: 2,
				textAlign: 'center',
				width: '100%',
				height: 'calc(100% - 43px)',
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'column',
				justifyContent: 'center'
			}}
		>
			{icon && (
				<Box sx={{ mb: 3 }}>
					{icon}
				</Box>
			)}
			{label && (
				<Typography
					variant="h2"
					sx={{ mb: description ? 2 : 0 }}
				>
					{label}
				</Typography>
			)}
			{description && (
				<Typography
					variant="body2"
					sx={[
						{ color: theme => theme.colors.gray },
						...(Array.isArray(descriptionSx) ? descriptionSx : [descriptionSx])
					]}
				>
					{description}
				</Typography>
			)}
		</Box>
	);
};
