import React, { FC, useCallback, memo } from "react";
import { CountryPhoneOption } from "../../../constants/country-phone.constants";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import { FlagsList } from "./phone-input.component";
import { CoreSelectMenuItem } from "../core-select";
import { flagIconStyle } from "./country-option.styles";
import { Country } from "react-phone-number-input";

interface CountryOptionProps extends CountryPhoneOption {
	selected?: boolean;
	onChange?(country: Country): void;
}

const CountryOption: FC<CountryOptionProps> = (props) => {
	const { code, callingCode, onChange, selected, ...menuItemProps } = props;

	const [t] = useTranslation();

	const handleClick = useCallback(() => {
		onChange?.(code);
	}, [code, onChange]);

	const Flag = FlagsList[code];

	return (
		<CoreSelectMenuItem
			onClick={handleClick}
			role='option'
			selected={selected}
			customContainer
			{...menuItemProps}
		>
			{Flag && <Flag width="16px" style={flagIconStyle} />}
			<Typography variant="label" noWrap sx={{ ml: 1 }}>
				{t(code, { ns: 'countries' })} {`(+${callingCode})`}
			</Typography>
		</CoreSelectMenuItem>
	);
};

export default memo(CountryOption);
