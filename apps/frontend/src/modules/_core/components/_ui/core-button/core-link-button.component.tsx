import React, { FC } from "react";
import { ButtonBase, ButtonBaseProps, useTheme } from "@mui/material";
import { Link } from 'react-router-dom';

interface CoreLinkButtonProps extends ButtonBaseProps {
	to?: string;
}

const CoreLinkButton: FC<CoreLinkButtonProps> = (props) => {
	const { to, sx, ...buttonProps } = props;

	const theme = useTheme();

	const Component = to ? Link : 'button';

	return (
		<ButtonBase
			{...buttonProps}
			component={Component}
			to={to}
			sx={{
				...theme.typography.body2,
				color: theme => theme.colors.blue,
				textDecoration: 'underline',
				'&:hover': {
					color: theme => theme.colors.gray
				},
				'&.Mui-disabled': {
					color: theme => theme.colors.blueTransparent
				},
				...sx
			}}
		/>
	);
};

export default CoreLinkButton;
