import { FC, useCallback, useState } from 'react';
import { Box } from '@mui/material';
import { PasswordDto, RestorePasswordDto } from '@boilerplate/shared';
import { useChangePasswordMutation } from '@/store/api/auth.api';
import { NewPasswordForm, PasswordForm } from '@/modules/auth/components/password-form';

type FormState = {
	activeForm: 'current-password' | 'new-password';
	oldPassword?: string | null;
	password: string | null;
	confirmPassword: string | null;
};

export interface ChangePasswordFormProps {
	email: string;
	onSubmit(): void;
}

export const ChangePasswordForm: FC<ChangePasswordFormProps> = (props) => {
	const { email, onSubmit } = props;

	const [changePassword] = useChangePasswordMutation();

	const [{ activeForm, oldPassword }, setFormState] = useState<FormState>({
		activeForm: 'current-password',
		oldPassword: null,
		password: null,
		confirmPassword: null,
	});

	const [changePasswordError, setChangePasswordError] = useState<Error | null>(null);

	const handleCheckCurrentPassword = useCallback(async ({ password }: PasswordDto) => {
		setFormState((state) => ({
			...state,
			activeForm: 'new-password',
			oldPassword: password,
		}));
	}, []);

	const handleChangePassword = useCallback(
		async (data: RestorePasswordDto) => {
			try {
				if (!email || !oldPassword) return;

				await changePassword({
					email,
					oldPassword,
					password: data.password,
					confirmPassword: data.confirmPassword,
				}).unwrap();

				onSubmit();
			} catch (error) {
				setChangePasswordError(error as Error);
			}
		},
		[changePassword, email, oldPassword, onSubmit]
	);

	const goBack = useCallback(() => {
		setFormState((state) => ({
			...state,
			activeForm: 'current-password',
		}));
		setChangePasswordError(null);
	}, []);

	return (
		<Box>
			{activeForm === 'current-password' && (
				<PasswordForm onSubmit={handleCheckCurrentPassword} showAdditionalActions={false} />
			)}
			{activeForm === 'new-password' && (
				<NewPasswordForm
					onSubmit={handleChangePassword}
					onBack={goBack}
					error={changePasswordError ?? undefined}
					errorI18nKey="check-password"
				/>
			)}
		</Box>
	);
};
