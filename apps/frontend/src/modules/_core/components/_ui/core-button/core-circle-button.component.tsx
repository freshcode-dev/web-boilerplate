import { styled } from "@mui/material/styles";
import { CoreButtonBase, CoreButtonBaseProps } from "./core-button-base.component";
import { StyledComponent } from "@emotion/styled";

export type CoreCircleButtonSize = 'medium' | 'large' | 'small';

export interface CoreCircleButtonProps extends CoreButtonBaseProps {
	size?: CoreCircleButtonSize;
}

const getButtonSize = (size?: CoreCircleButtonSize) => {
	switch (size) {
		case 'large':
			return {
				width: 48,
				height: 48,
				borderRadius: 24
			};
		case 'small':
			return {
				width: 36,
				height: 36,
				borderRadius: 18
			};
		case 'medium':
		default:
			return {
				width: 40,
				height: 40,
				borderRadius: 20
			};
	}
};

export const CoreCircleButton: StyledComponent<CoreCircleButtonProps> = styled(CoreButtonBase)<CoreCircleButtonProps>(
	({ size }) => ({
		padding: '0',
		...getButtonSize(size)
	})
);
