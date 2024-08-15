import { useRef, useCallback } from 'react';

export const useCustomGoogleAuthButton = () => {
	const googleButtonRef = useRef<HTMLElement | null>(null);

	const setGoogleButtonRef = useCallback((ref: HTMLElement | null) => {
		googleButtonRef.current = ref;
	}, []);

	const handleGoogleButtonClick = useCallback(() => {
		googleButtonRef.current?.click();
	}, []);

	return { setGoogleButtonRef, handleGoogleButtonClick };
};
