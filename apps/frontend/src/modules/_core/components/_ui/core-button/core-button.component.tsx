import React, { FC } from "react";
import { CoreButtonBase, CoreButtonBaseProps } from "./core-button-base.component";
import { FadeSpinner } from '../fade-spinner';
import { useTheme } from "@mui/material";
import { CoreCircleButton, CoreCircleButtonProps } from "./core-circle-button.component";

type DefaultButtonType = CoreButtonBaseProps & { circle?: false };
type CircleButtonType = CoreCircleButtonProps & { circle: true };

export type CoreButtonProps = (DefaultButtonType | CircleButtonType) & { loading?: boolean };

export const CoreButton: FC<CoreButtonProps> = (props) => {
	const { loading, circle, disabled, children, ...buttonProps } = props;

	const theme = useTheme();

	const Component = circle ? CoreCircleButton : CoreButtonBase;
	const size = circle ? props.size : undefined;
	const hideChildren = loading && circle;

	return (
		<Component
			{...buttonProps}
			size={size}
			disabled={loading || disabled}
			className={loading ? "core-button-loading" : undefined}
		>
			{loading && (
				<FadeSpinner
					size={17}
					height={5}
					width={2}
					borderRadius={1}
					color={theme.colors.white}
					sx={{ marginRight: circle ? 0 : '10px' }}
				/>
			)}
			{!hideChildren && children}
		</Component>
	);
};
