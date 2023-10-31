import React, {FC, useCallback} from "react";
import { Menu } from "@mui/material";
import CountryOption from "./country-option.component";
import { selectPaperStyles } from "../core-select/core-select.styles";
import { Country } from "react-phone-number-input";
import { CountryPhoneOption } from "../../../constants/country-phone.constants";

interface CountriesMenuProps {
	open: boolean;
	anchor: HTMLElement | null;
	value: Country;
	countries: CountryPhoneOption[];
	onClose(): void;
	onBlur(): void;
	onFocus(): void;
	onChange?(country: Country): void;
}

const CountriesMenu: FC<CountriesMenuProps> = (props) => {
	const { onBlur, onFocus, open, countries, anchor, onClose, onChange, value } = props;

	const handleChange = useCallback((country: Country) => {
		onChange?.(country);
		onClose();
	}, [onChange, onClose]);

	return (
		<Menu
			onBlur={onBlur}
			onFocus={onFocus}
			open={open}
			anchorEl={anchor}
			onClose={onClose}
			MenuListProps={{
				role: 'listbox'
			}}
			PaperProps={{
				sx: {
					...selectPaperStyles,
					maxHeight: 200,
					width: anchor?.offsetWidth,
				}
			}}
		>
			{countries.map(country => (
				<CountryOption
					{...country}
					selected={country.code === value}
					key={country.code}
					onChange={handleChange}
				/>
			))}
		</Menu>
	);
};

export default CountriesMenu;
