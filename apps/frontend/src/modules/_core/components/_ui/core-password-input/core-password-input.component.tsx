import { forwardRef, useCallback, useState } from 'react';
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
	const { defaultShowPassword, iconHidePassword, iconShowPassword, onlyShowOnMouseDown, ...inputProps } = props;

	const [showPassword, setShowPassword] = useState(defaultShowPassword ?? false);

	const showIcon = iconShowPassword ?? <VisibilityIcon />;
	const hideIcon = iconHidePassword ?? <VisibilityOffIcon />;

	const handleClickShowPassword = () => {
		if (onlyShowOnMouseDown) return;

		setShowPassword((s) => !s);
	};

	const handleMouseUpPassword = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();

		if (onlyShowOnMouseDown) {
			setShowPassword(false);
		}
	}, [onlyShowOnMouseDown]);

	const handleMouseDownPassword = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();

		if (onlyShowOnMouseDown) {
			setShowPassword(true);
		}
	}, [onlyShowOnMouseDown]);

	return (
		<CoreTextField
			{...inputProps}
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
