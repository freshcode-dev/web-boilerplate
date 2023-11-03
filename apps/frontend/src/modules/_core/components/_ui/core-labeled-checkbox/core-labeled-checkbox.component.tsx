import { forwardRef } from 'react';
import { FormControlLabel } from '@mui/material';
import { CoreCheckbox, CoreCheckboxProps } from '../core-checkbox';
import { labelStyle } from './core-labeled-checkbox.styles';

export interface CoreLabeledCheckboxProps extends CoreCheckboxProps {
	label?: string | null;
}

export const CoreLabeledCheckbox: React.FC<CoreLabeledCheckboxProps> = forwardRef(({ label, ...props }, ref) => (
	<FormControlLabel
		sx={labelStyle}
		label={label}
		required={props.required}
		disabled={props.disabled}
		control={<CoreCheckbox ref={ref} {...props} />}
	/>
));
