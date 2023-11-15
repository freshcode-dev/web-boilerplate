import { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { UpdateUserDataDto, UserDto } from '@boilerplate/shared';
import { CoreModal } from '../../../../_core/components/_ui/core-modal';
import { ChangeUserDataForm } from '../../change-user-data-form';
import { useUpdateUserMutation } from '../../../../../store/api/users.api';
import { getErrorStatusCode, getFieldFromConflictError } from '../../../../_core/utils/error.utils';
import { useGetProfileQuery } from '../../../../../store/api/auth.api';

export interface EditUserDataModalProps {
	data: UserDto;
	open: boolean;
	onClose?(): void;
}

export const EditUserDataModal: FC<EditUserDataModalProps> = (props) => {
	const { data, open, onClose } = props;

	const [t] = useTranslation();

	const { refetch: refetchProfile } = useGetProfileQuery();
	const [updateUser] = useUpdateUserMutation();

	const handleSubmitModal = useCallback(
		async (values: UpdateUserDataDto, markError: (field?: string) => void) => {
			try {
				await updateUser({ id: data.id, data: values });

				await refetchProfile();

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
			}
		},
		[data.id, onClose, updateUser, refetchProfile]
	);

	return (
		<CoreModal open={open} onClose={onClose} modalTitle={t('profile.change-user-data-ph')}>
			<ChangeUserDataForm data={data} onSubmit={handleSubmitModal} />
		</CoreModal>
	);
};
