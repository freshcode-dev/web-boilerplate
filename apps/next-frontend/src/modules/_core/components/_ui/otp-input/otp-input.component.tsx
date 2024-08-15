import React, { FC } from 'react';
import { CoreInput } from '../core-input';
import OTP from 'react-otp-input';

interface OtpInputProps {
	value?: string;
	numInputs: number;
	error?: boolean;
	onChange(value: string): void;
}

export const OtpInput: FC<OtpInputProps> = (props) => {
	const { value, onChange, numInputs, error } = props;

	return (
		<OTP
			value={value}
			onChange={onChange}
			numInputs={numInputs}
			containerStyle={{
				justifyContent: 'center'
			}}
			renderInput={inputProps => (
				<CoreInput
					sx={{
						width: '48px',
						height: '48px',
						mx: 1,
					}}
					error={error}
					inputProps={{
						...inputProps,
						inputMode: 'numeric',
						pattern: '[0-9]*',
						sx: {
							textAlign: 'center'
						}
					}}
				/>
			)}
		/>
	);
};
