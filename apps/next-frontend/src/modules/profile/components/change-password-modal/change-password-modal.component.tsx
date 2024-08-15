import { FC, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { CoreModal } from '../../../_core/components/_ui/core-modal';
import { ChangePasswordForm } from '../change-password-form';

export interface ChangePasswordModalProps {
	email: string;
	open: boolean;
	onClose?(): void;
}

export const ChangePasswordModal: FC<ChangePasswordModalProps> = (props) => {
	const { email, open, onClose } = props;

	const [t] = useTranslation();

	const handleSubmit = useCallback(async () => {
		onClose?.();
	}, [onClose]);

	return (
		<CoreModal open={open} onClose={onClose} modalTitle={t('profile.change-password-ph')}>
			<ChangePasswordForm email={email} onSubmit={handleSubmit} />
		</CoreModal>
	);
};
