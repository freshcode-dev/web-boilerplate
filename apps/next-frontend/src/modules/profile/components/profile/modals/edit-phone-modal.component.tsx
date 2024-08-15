import { FC, useCallback, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { CoreModal } from '@/modules/_core/components/_ui/core-modal';
import { AuthReasonEnum, ConfirmationCodeDto, PhoneDto } from '@boilerplate/shared';
import {
	useChangeLoginMutation,
	useChangeLoginRequestMutation,
} from '@/store/api/auth.api';
import { getErrorStatusCode, getFieldFromHttpError } from '@/modules/_core/utils/error.utils';
import { PhoneForm } from '@/modules/auth/components/phone-form';
import { CodeConfirmationForm } from '@/modules/auth/components/code-confirmation-form';

type FormState = {
	activeForm: 'data' | 'code';
	newPhone: string | null;
	verifyId?: string;
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

	const [{ activeForm, newPhone, verifyId }, setFormState] = useState<FormState>({
		activeForm: 'data',
		newPhone: null,
		verifyId: undefined,
	});

	const [changePhoneRequestError, setChangePhoneRequestError] = useState<Error | null>(null);
	const [changePhoneError, setChangePhoneError] = useState<Error | null>(null);

	const handleSubmitPhone = useCallback(
		async (data: PhoneDto, markError: (field?: string) => void) => {
			try {
				const response = await changeLoginRequest(data).unwrap();

				setFormState((prevState) => ({
					...prevState,
					activeForm: 'code',
					newPhone: data.phoneNumber,
					verifyId: response?.id,
				}));
			} catch (error) {
				const status = getErrorStatusCode(error as Error);

				if (status === 404) {
					markError();
				}

				if (status === 409) {
					const field = getFieldFromHttpError(error as Error);

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
				if (!newPhone || !verifyId) return;

				await changeLogin({ phoneNumber: newPhone, code, verifyId });

				onClose?.();
			} catch (error) {
				const status = getErrorStatusCode(error as Error);

				if (status === 404) {
					markError();
				}

				if (status === 409) {
					const field = getFieldFromHttpError(error as Error);

					if (field) markError(field);
				}

				setChangePhoneError(error as Error);
			}
		},
		[changeLogin, newPhone, onClose, verifyId]
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
