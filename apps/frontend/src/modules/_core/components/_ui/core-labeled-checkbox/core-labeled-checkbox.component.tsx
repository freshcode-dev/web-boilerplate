import React, { FC, forwardRef, RefAttributes } from 'react';
import { CheckboxProps, FormControlLabel } from '@mui/material';
import { CoreCheckbox } from '../core-checkbox';
import { labelStyle } from './core-labeled-checkbox.styles';

export interface CoreLabeledCheckboxProps extends CheckboxProps {
	label?: string | null;
}


export const CoreLabeledCheckbox: FC<Omit<CoreLabeledCheckboxProps, 'ref'> & RefAttributes<HTMLButtonElement>> = forwardRef(({ label, ...props }, ref) => (
	<FormControlLabel
		sx={labelStyle}
		label={label}
		required={props.required}
		disabled={props.disabled}
		/*
		// @ts-expect-error ref types are incompatible for this specific component */
		control={<CoreCheckbox ref={ref} {...props} />}
	/>
));
