import { isIP } from "class-validator";

export const prepareIpAddress = (ipAddress: string): string => {
	if (!isIP(ipAddress, 4)) {
		return ipAddress;
	}

	// IPv4 example: ::ffff:111.222.333.444
	const parts = ipAddress.split(':');

	if (parts.length === 1) {
		return ipAddress;
	}

	return parts.pop() as string;
}
