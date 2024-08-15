import { FC, useRef, useEffect } from 'react';
import { GOOGLE_API_CLIENT_ID, IS_GOOGLE_AUTH_ENABLED } from '@/constants';
import { GSIClientContextProvider } from '@/modules/auth/contexts/gsi-client.context';

export interface GoogleAuthButtonProps {
	type?: 'standard' | 'icon';
	theme?: 'filled_blue' | 'outline' | 'filled_black';
	size?: 'small' | 'medium' | 'large';
	text?: 'continue_with' | 'signin_with' | 'signup_with';
	shape?: 'rectangular' | 'square' | 'circle' | 'pill';
	logoAlignment?: 'left' | 'center';
	show?: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onSuccess?(response: any): void;
	setButtonRef?(ref: Element | null): void;
}

export const GoogleAuthButton: FC<GoogleAuthButtonProps> = ({
	show = true,
	type,
	theme = 'filled_blue',
	size = 'large',
	text = 'continue_with',
	shape = 'rectangular',
	logoAlignment = 'left',
	setButtonRef,
	onSuccess,
}) => {
	const buttonRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (typeof window === 'undefined' || !buttonRef.current) {
			return;
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(window as any).google?.accounts?.id?.renderButton(buttonRef.current, {
			type,
			theme,
			size,
			text,
			shape,
			logo_alignment: logoAlignment,
		});

		const divButton = buttonRef?.current?.querySelector('div[role=button]');

		setButtonRef?.(divButton);
	}, [type, theme, size, text, shape, logoAlignment, setButtonRef]);

	if (!IS_GOOGLE_AUTH_ENABLED) {
		return null;
	}

	if (onSuccess) {
		return (
			<GSIClientContextProvider isEnabled={IS_GOOGLE_AUTH_ENABLED} clientId={GOOGLE_API_CLIENT_ID} callback={onSuccess}>
				<div
					id="google-auth-button"
					className="custom-google-button"
					ref={buttonRef}
					style={{
						...(show ? {} : { display: 'none' }),
					}}
				></div>
			</GSIClientContextProvider>
		);
	}

	return (
		<div
			id="google-auth-button"
			className="custom-google-button"
			ref={buttonRef}
			style={{
				...(show ? {} : { display: 'none' }),
			}}
		/>
	);
};
