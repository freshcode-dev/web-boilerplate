import { Country, getCountries, getCountryCallingCode } from 'react-phone-number-input';

export interface CountryPhoneOption {
	code: Country;
	callingCode: string;
}

export const CountryPhoneOptions: CountryPhoneOption[] = getCountries().map(code => ({
	code,
	callingCode: getCountryCallingCode(code)
}));
