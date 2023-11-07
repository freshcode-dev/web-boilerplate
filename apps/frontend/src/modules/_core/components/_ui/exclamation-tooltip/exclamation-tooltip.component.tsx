import React, { FC, ReactNode } from "react";
import { CoreTooltip } from "../core-tooltip";
import { Box, SxProps, Theme, TooltipProps } from "@mui/material";
import { Info } from "../../../constants/icons.constants";

interface ExclamationTooltipProps {
	title?: ReactNode | null;
	iconSx?: SxProps<Theme>;
	placement?: TooltipProps['placement'];
}

export const ExclamationTooltip: FC<ExclamationTooltipProps> = (props) => {
	const { title, placement, iconSx } = props;

	return (
		<CoreTooltip
			arrow
			placement={placement}
			title={title}
		>
			<Box
				component={Info}
				sx={{
					minWidth: 16,
					...iconSx
				}}
			/>
		</CoreTooltip>
	);
};
