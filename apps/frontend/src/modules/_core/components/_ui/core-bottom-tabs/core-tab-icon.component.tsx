import { FC, ReactNode } from "react";
import { Box } from "@mui/material";

interface CoreTabIconProps {
	children?: ReactNode;
	active?: boolean;
}

export const CoreTabIcon: FC<CoreTabIconProps> = (props) => {
	const { children, active } = props;

	return (
		<Box
			sx={{
				width: 64,
				height: 32,
				borderRadius: 10,
				mb: 0.5,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				bgcolor: active
					? theme => theme.colors.grayLight
					: 'transparent'
			}}
		>
			{children}
		</Box>
	);
};
