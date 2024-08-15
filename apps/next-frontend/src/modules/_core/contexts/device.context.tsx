import { IS_BROWSER } from '@/constants';
import { FC, PropsWithChildren, createContext, useContext, useMemo } from 'react';
import { IResult } from 'ua-parser-js';
import { parseUserAgent } from '@/modules/_core/utils/session.utils';
import { UserAgentType } from '@/modules/_core/types';

const getDeviceInfo = (userAgent: UserAgentType) => {
	const deviceInfo = parseUserAgent(userAgent);

	const { ua, ...rest } = deviceInfo;

	return {
		userAgent: ua,
		deviceInfo: {
			...rest,
		},
		isMobile: rest.device?.type === 'mobile',
		isTablet: rest.device?.type === 'tablet',
	};
};

type DeviceContextType = {
	userAgent: UserAgentType;
	deviceInfo?: Omit<IResult, 'ua'>;
	isMobile: boolean;
	isTablet: boolean;
};

export const DeviceContext = createContext<DeviceContextType>(getDeviceInfo(IS_BROWSER ? navigator.userAgent : 'SSR'));

export const DeviceProvider: FC<PropsWithChildren<{ userAgent: UserAgentType }>> = ({ userAgent, children }) => {
	const contextValue = useMemo<DeviceContextType>(() => getDeviceInfo(userAgent), [userAgent]);

	return <DeviceContext.Provider value={contextValue}>{children}</DeviceContext.Provider>;
};

export const DeviceConsumer = DeviceContext.Consumer;

export const useDevice = () => useContext(DeviceContext);
