import { FC } from "react";
import { Typography } from "@mui/material";

interface CoreTabLabelProps {
	label?: string | null;
	active?: boolean;
}

export const CoreTabLabel: FC<CoreTabLabelProps> = (props) => {
	const { label, active } = props;

	return (
		<Typography
			noWrap
			variant="label"
			fontWeight={400}
			sx={{ color: ({ colors }) => (active
					? colors.blue
					: colors.darkGray) }}
		>
			{label}
		</Typography>
	);
};
