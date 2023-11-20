import { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CoreModal } from '../../../../_core/components/_ui/core-modal';
import { AuthReasonEnum, ConfirmationCodeDto, EmailDto } from '@boilerplate/shared';
import {
	useChangeLoginMutation,
	useChangeLoginRequestMutation,
} from '../../../../../store/api/auth.api';
import { EmailForm, CodeConfirmationForm } from '../../../../auth';
import { getErrorStatusCode, getFieldFromConflictError } from '../../../../_core/utils/error.utils';

type FormState = {
	activeForm: 'data' | 'code';
	newEmail: string | null;
	verifyId?: string;
};

export interface EditEmailModalProps {
	email?: string;
	open: boolean;
	onClose?(): void;
}

export const EditEmailModal: FC<EditEmailModalProps> = (props) => {
	const { open, onClose, email } = props;

	const [t] = useTranslation();

	const [changeLoginRequest] = useChangeLoginRequestMutation();
	const [changeLogin] = useChangeLoginMutation();

	const [{ activeForm, newEmail, verifyId }, setFormState] = useState<FormState>({
		activeForm: 'data',
		newEmail: null,
		verifyId: undefined,
	});

	const [changeEmailRequestError, setChangeEmailRequestError] = useState<Error | null>(null);
	const [changeEmailError, setChangeEmailError] = useState<Error | null>(null);

	const handleSubmitEmail = useCallback(
		async (data: EmailDto, markError: (field?: string) => void) => {
			try {
				const response = await changeLoginRequest(data).unwrap();

				setFormState((prevState) => ({
					...prevState,
					activeForm: 'code',
					newEmail: data.email,
					verifyId: response?.id,
				}));
			} catch (error) {
				const status = getErrorStatusCode(error as Error);

				if (status === 404) {
					markError();
				}

				if (status === 409) {
					const field = getFieldFromConflictError(error as Error);

					if (field) markError(field);
				}

				setChangeEmailRequestError(error as Error);
			}
		},
		[changeLoginRequest]
	);

	const handleSubmitModal = useCallback(
		async ({ code }: ConfirmationCodeDto, markError: (field?: string) => void) => {
			try {
				if (!newEmail || !verifyId) return;

				await changeLogin({ email: newEmail, code, verifyId });

				onClose?.();
			} catch (error) {
				const status = getErrorStatusCode(error as Error);

				if (status === 404) {
					markError();
				}

				if (status === 409) {
					const field = getFieldFromConflictError(error as Error);

					if (field) markError(field);
				}

				setChangeEmailError(error as Error);
			}
		},
		[changeLogin, newEmail, onClose, verifyId]
	);

	const goBack = useCallback(() => {
		setFormState((prevState) => ({
			...prevState,
			activeForm: 'data',
		}));
	}, []);

	return (
		<CoreModal open={open} onClose={onClose} modalTitle={t('profile.change-email-ph')}>
			{activeForm === 'data' && (
				<EmailForm
					onSubmit={handleSubmitEmail}
					email={email as string}
					error={changeEmailRequestError ?? undefined}
					validate
					showAdditionalActions={false}
				/>
			)}
			{activeForm === 'code' && (
				<CodeConfirmationForm
					reason={AuthReasonEnum.ChangeEmail}
					email={newEmail as string}
					onSubmit={handleSubmitModal}
					error={changeEmailError ?? undefined}
					onBack={goBack}
				/>
			)}
		</CoreModal>
	);
};
