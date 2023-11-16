import { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CoreModal } from '../../../../_core/components/_ui/core-modal';
import { AuthReasonEnum, ConfirmationCodeDto, PhoneDto } from '@boilerplate/shared';
import {
	useChangeLoginMutation,
	useChangeLoginRequestMutation,
} from '../../../../../store/api/auth.api';
import { CodeConfirmationForm, PhoneForm } from '../../../../auth';
import { getErrorStatusCode, getFieldFromConflictError } from '../../../../_core/utils/error.utils';

type FormState = {
	activeForm: 'data' | 'code';
	newPhone: string | null;
	code: string | null;
};

export interface EditPhoneModalProps {
	phoneNumber?: string;
	open: boolean;
	onClose?(): void;
}

export const EditPhoneModal: FC<EditPhoneModalProps> = (props) => {
	const { open, onClose, phoneNumber } = props;

	const [t] = useTranslation();

	const [changeLoginRequest] = useChangeLoginRequestMutation();
	const [changeLogin] = useChangeLoginMutation();

	const [{ activeForm, newPhone }, setFormState] = useState<FormState>({
		activeForm: 'data',
		newPhone: null,
		code: null,
	});

	const [changePhoneRequestError, setChangePhoneRequestError] = useState<Error | null>(null);
	const [changePhoneError, setChangePhoneError] = useState<Error | null>(null);

	const handleSubmitPhone = useCallback(
		async (data: PhoneDto, markError: (field?: string) => void) => {
			try {
				await changeLoginRequest(data).unwrap();

				setFormState((prevState) => ({
					...prevState,
					activeForm: 'code',
					newPhone: data.phoneNumber,
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

				setChangePhoneRequestError(error as Error);
			}
		},
		[changeLoginRequest]
	);

	const handleSubmitModal = useCallback(
		async ({ code }: ConfirmationCodeDto, markError: (field?: string) => void) => {
			try {
				if (!newPhone) return;

				await changeLogin({ phoneNumber: newPhone, code });

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

				setChangePhoneError(error as Error);
			}
		},
		[changeLogin, newPhone, onClose]
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
				<PhoneForm
					onSubmit={handleSubmitPhone}
					phoneNumber={phoneNumber as string}
					error={changePhoneRequestError ?? undefined}
					showAdditionalActions={false}
					validate
				/>
			)}
			{activeForm === 'code' && (
				<CodeConfirmationForm
					reason={AuthReasonEnum.ChangePhoneNumber}
					email={newPhone as string}
					onSubmit={handleSubmitModal}
					error={changePhoneError ?? undefined}
					onBack={goBack}
				/>
			)}
		</CoreModal>
	);
};
