import { FC, useRef, useEffect } from 'react';
import { GSIClientContextProvider } from '../../../contexts/gsi-client.context';
import { configService } from '../../../../_core';

export interface GoogleAuthButtonProps {
	type?: 'standard' | 'icon';
	theme?: 'filled_blue' | 'outline' | 'filled_black';
	size?: 'small' | 'medium' | 'large';
	text?: 'continue_with' | 'signin_with' | 'signup_with';
	shape?: 'rectangular' | 'square' | 'circle' | 'pill';
	logoAlignment?: 'left' | 'center';
	show?: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onSuccess(response: any): void;
	setButtonRef?(ref: Element | null): void;
}

const GoogleAuthButton: FC<GoogleAuthButtonProps> = ({
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
		(window as any).google.accounts.id.renderButton(buttonRef.current, {
			type,
			theme,
			size,
			text,
			shape,
			logo_alignment: logoAlignment,
		});

		const divButton = buttonRef.current.querySelector('div[role=button]');

		setButtonRef?.(divButton);
	}, [type, theme, size, text, shape, logoAlignment, setButtonRef]);

	return (
		<GSIClientContextProvider clientId={configService.get('NX_GOOGLE_API_CLIENT_ID') as string} callback={onSuccess}>
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
};

export default GoogleAuthButton;
