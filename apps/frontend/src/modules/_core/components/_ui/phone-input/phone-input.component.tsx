import React, { FC, useCallback, useRef, useState } from "react";
import Flags, { FlagComponent } from "country-flag-icons/react/3x2";
import { Country } from "react-phone-number-input";
import Input from 'react-phone-number-input/react-hook-form';
import { CoreFormControlProps } from "../core-form-control/core-form-control.component";
import PhoneForwardedTextField from "./phone-forwarded-text-field.component";
import CountriesMenu from "./countries-menu.component";
import { CountryPhoneOptions } from "../../../constants/country-phone.constants";
import { Control } from "react-hook-form";

export const FlagsList: Record<Country, FlagComponent> = Flags as Record<Country, FlagComponent>;

interface PhoneInputProps extends CoreFormControlProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: Control<any>;
	name: string;
}

export const PhoneInput: FC<PhoneInputProps> = (props) => {
	const [countryCode, setCountryCode] = useState<Country>('UA');
	const [showMenu, setMenuVisibility] = useState(false);
	const inputWrapperRef = useRef<HTMLElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleCountryCodeChange = useCallback((code: Country) => {
		setCountryCode(code);
	}, []);

	const handleMenuOpen = useCallback(() => {
		inputRef.current?.focus();
		setMenuVisibility(true);
	}, []);

	const handleMenuClose = useCallback(() => {
		setMenuVisibility(false);
	}, []);

	return (
		<Input
			{...props}
			inputComponent={PhoneForwardedTextField}
			countryCallingCodeEditable
			international
			ref={inputRef}
			countryCode={countryCode}
			onCountryChange={handleCountryCodeChange}
			inputWrapperRef={inputWrapperRef}
			showMenu={showMenu}
			onMenuOpen={handleMenuOpen}
			defaultCountry={countryCode}
			countrySelectComponent={CountriesMenu}
			countrySelectProps={{
				open: showMenu,
				anchor: inputWrapperRef.current,
				onClose: handleMenuClose,
				countries: CountryPhoneOptions
			}}
		/>
	);
};
