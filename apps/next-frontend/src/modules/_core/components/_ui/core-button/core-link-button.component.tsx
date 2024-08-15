import { ButtonBase, ButtonBaseProps, useTheme } from '@mui/material';
import Link from 'next/link';
import { FC, HTMLAttributeAnchorTarget } from 'react';
import { coreLinkButtonStyles } from './core-button.styles';

interface CoreLinkButtonProps extends ButtonBaseProps {
	to?: string;
	target?: HTMLAttributeAnchorTarget;
}

export const CoreLinkButton: FC<CoreLinkButtonProps> = (props) => {
	const { to, sx, target, ...buttonProps } = props;

	const theme = useTheme();

	const Component = to ? Link : 'button';

	return (
		<ButtonBase {...buttonProps} component={Component} href={to} target={target} sx={coreLinkButtonStyles(theme, sx)} />
	);
};
