import React, { forwardRef, Ref } from "react";
import { CoreFormControl, CoreFormControlProps } from "../core-form-control";
import { CoreInput, CoreInputProps } from "../core-input";
import { InputBaseProps } from "@mui/material";

export interface CoreTextFieldProps extends CoreFormControlProps, InputBaseProps, CoreInputProps {
	wrapperRef?: Ref<unknown>;
}

export const CoreTextField = forwardRef<unknown, CoreTextFieldProps>((props, ref) => {
	const {
		id,
		fullWidth,
		controlSx,
		label,
		helperText,
		error,
		disabled,
		focused,
		inputRef,
		wrapperRef,
		requiredMark,
		...inputProps
	} = props;

	return (
		<CoreFormControl
			disabled={disabled}
			error={error}
			helperText={helperText}
			label={label}
			id={id}
			requiredMark={requiredMark}
			focused={focused}
			fullWidth={fullWidth}
			controlSx={controlSx}
		>
			<CoreInput
				{...inputProps}
				id={id}
				ref={wrapperRef}
				inputRef={inputRef ?? ref}
			/>
		</CoreFormControl>
	);
});
