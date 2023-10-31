import React, { forwardRef, Ref } from "react";
import { InputAdornment } from "@mui/material";
import CountryAdornment from "./country-adornment.component";
import { CoreTextField } from "../core-textfield/core-textfield.component";
import { Country } from "react-phone-number-input";
import { CoreFormControlProps } from "../core-form-control/core-form-control.component";

interface PhoneForwardedTextField extends CoreFormControlProps {
	countryCode: Country;
	inputWrapperRef: Ref<unknown>;
	showMenu?: boolean;
	onMenuOpen?(): void;
}

const PhoneForwardedTextField = forwardRef<HTMLInputElement, PhoneForwardedTextField>((props, ref) => {
	const {
		inputWrapperRef,
		showMenu,
		countryCode,
		onMenuOpen,
		...inputProps
	} = props as PhoneForwardedTextField;

	return (
		<CoreTextField
			{...inputProps}
			wrapperRef={inputWrapperRef}
			focused={showMenu || undefined}
			inputRef={ref}
			startAdornment={
				<InputAdornment position="start" sx={{ mr: 0 }}>
					<CountryAdornment
						country={countryCode}
						onClick={onMenuOpen}
						open={showMenu}
					/>
				</InputAdornment>
			}
		/>
	);
});

export default PhoneForwardedTextField;
