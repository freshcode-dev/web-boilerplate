import React, { FC, memo } from "react";
import { Country } from 'react-phone-number-input';
import { flagIconStyle } from "./country-option.styles";
import { FlagsList } from "./phone-input.component";
import DropdownArrow from "../core-select/dropdown-arrow.component";
import { ButtonBase, Box } from "@mui/material";
import { Public } from '@mui/icons-material';

interface CountryAdornmentProps {
	country: Country;
	open?: boolean;
	onClick?(): void;
}

const CountryAdornment: FC<CountryAdornmentProps> = (props) => {
	const { onClick, country, open } = props;

	const Flag = FlagsList[country];

	return (
		<ButtonBase
			onClick={onClick}
			sx={{
				height: '28px',
				borderRadius: '4px',
				fontSize: 16,
				paddingLeft: '8px',
				'&.Mui-focusVisible': {
					backgroundColor: theme => theme.colors.blueTransparent
				}
			}}
		>
			{Flag
				? <Flag width="16px" style={flagIconStyle} />
				: <Public fontSize="inherit" sx={{ color: theme => theme.colors.gray }}/>
			}
			<Box sx={{ pr: 0.5 }} />
			<DropdownArrow forceFocus={open} />
		</ButtonBase>
	);
};

export default memo(CountryAdornment);
