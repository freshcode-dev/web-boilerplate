import { forwardRef, useState } from 'react';
import { CoreTextField, CoreTextFieldProps } from '../core-textfield';
import { IconButton, InputAdornment } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export interface CorePasswordInputProps extends CoreTextFieldProps {
	defaultShowPassword?: boolean;
	iconShowPassword?: React.ReactNode;
	iconHidePassword?: React.ReactNode;
	onlyShowOnMouseDown?: boolean;
}

export const CorePasswordInput = forwardRef<unknown, CorePasswordInputProps>((props, ref) => {
	const [showPassword, setShowPassword] = useState(props.defaultShowPassword ?? false);

	const showIcon = props.iconShowPassword ?? <VisibilityIcon />;
	const hideIcon = props.iconHidePassword ?? <VisibilityOffIcon />;

	const handleClickShowPassword = () => {
		if (props.onlyShowOnMouseDown) return;

		setShowPassword((s) => !s);
	};

	const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();

		if (props.onlyShowOnMouseDown) {
			setShowPassword(false);
		}
	};

	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();

		if (props.onlyShowOnMouseDown) {
			setShowPassword(true);
		}
	};

	return (
		<CoreTextField
			{...props}
			endAdornment={
				<InputAdornment position="end">
					<IconButton
						aria-label="toggle password visibility"
						onClick={handleClickShowPassword}
						onMouseUp={handleMouseUpPassword}
						onMouseDown={handleMouseDownPassword}
						edge="end"
					>
						{showPassword ? showIcon : hideIcon}
					</IconButton>
				</InputAdornment>
			}
			type={showPassword ? 'test' : 'password'}
			ref={ref}
		/>
	);
});
