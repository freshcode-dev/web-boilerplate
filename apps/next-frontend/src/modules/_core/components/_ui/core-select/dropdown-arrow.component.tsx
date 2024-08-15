import React, { FC } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

interface DropdownArrowProps extends SvgIconProps {
	forceFocus?: boolean;
}

export const DropdownArrow: FC<DropdownArrowProps> = (props) => {
	const { forceFocus, ...iconProps } = props;

	const rotate = forceFocus ? 180 : 0;

	return (
		<SvgIcon
			{...iconProps}
			viewBox="0 0 16 16"
			sx={{
				fontSize: 16,
				fill: 'none',
				stroke: theme => !forceFocus ? theme.colors.gray : theme.colors.black,
				transform: `rotate(${rotate}deg)`,
				'&.MuiSelect-iconOpen': {
					stroke: theme => theme.colors.black
				}
			}}
		>
			<path d="M4 6L8 10L12 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
		</SvgIcon>
	);
};
