import { createContext, useContext, useEffect, FC, PropsWithChildren, useMemo, useState } from 'react';

type GSIClientContextType = {
	isLoaded: boolean;
};

const GSIClientContext = createContext<GSIClientContextType>({
	isLoaded: false,
});

export const useGSIClientContext = () => useContext(GSIClientContext);

type GSIClientContextProviderProps = {
	isEnabled?: boolean;
	clientId: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	callback(response: any): void;
};

export const GSIClientContextProvider: FC<PropsWithChildren<GSIClientContextProviderProps>> = ({
	isEnabled,
	clientId,
	callback,
	children,
}) => {
	if (!clientId && isEnabled) {
		throw new Error('Google API client id is required');
	}

	const [isLoaded, setIsLoaded] = useState(false);

	const contextValue = useMemo(
		() => ({
			isLoaded,
		}),
		[isLoaded]
	);

	useEffect(() => {
		if (typeof window === 'undefined' || !isEnabled) {
			setIsLoaded(true);

			return;
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(window as any).google.accounts.id.initialize({
			client_id: clientId,
			callback,
		});

		setIsLoaded(true);
	}, [callback, clientId]);

	return <GSIClientContext.Provider value={contextValue}>{children}</GSIClientContext.Provider>;
};
