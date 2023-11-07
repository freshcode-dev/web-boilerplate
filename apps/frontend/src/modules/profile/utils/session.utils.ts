import { UAParser } from 'ua-parser-js';
import { IpAddressDetails, SessionDto, prepareIpAddress } from '@boilerplate/shared';

export const parseUserAgent = (userAgent: string) => new UAParser(userAgent).getResult();

export const getUserAgentText = (userAgent: string): string => {
	const parsedUA = parseUserAgent(userAgent);

	const browser = parsedUA.browser;
	const os = parsedUA.os;

	const result = `${os.name} ${os.version} - ${browser.name} ${browser.version}`;

	return result;
};

export const getIpAddressText = (ipAddressDetails?: IpAddressDetails): string | undefined => {
	if (!ipAddressDetails?.city || !ipAddressDetails?.region || !ipAddressDetails?.country_name) return;

	const result = `${ipAddressDetails.city}, ${ipAddressDetails.region}, ${ipAddressDetails.country_name}`;

	return result;
};

export const prepareSession = (sessionData: SessionDto): SessionDto => {
	const preparedIpAddress = prepareIpAddress(sessionData.ipAddress);

	const session: SessionDto = {
		...sessionData,
		ipAddress: preparedIpAddress,
		userAgentText: getUserAgentText(sessionData.userAgent),
		ipAddressText: getIpAddressText(sessionData.ipAddressDetails) ?? preparedIpAddress,
	};

	return session;
};
