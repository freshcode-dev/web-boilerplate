import { FC, useCallback } from 'react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useForm } from 'react-hook-form';
import { UpdateUserDataDto, UserDto } from '@boilerplate/shared';
import { Box } from '@mui/material';
import { CoreTextField } from '../../../_core/components/_ui/core-textfield';
import { CoreButton } from '../../../_core/components/_ui/core-button';
import { formStyles } from '../profile/modals/edit-user-data-modal.styles';

const resolver = classValidatorResolver(UpdateUserDataDto);

export interface ChangeUserDataFormProps {
	data: UserDto;
	onSubmit(newData: UpdateUserDataDto, markError: (field?: string) => void): Promise<void> | void;
}

export const ChangeUserDataForm: FC<ChangeUserDataFormProps> = (props) => {
	const { data, onSubmit } = props;

	const { register, handleSubmit, setError } = useForm<UpdateUserDataDto>({
		defaultValues: UpdateUserDataDto.instantiate(data),
		resolver,
	});

	const handleSubmitForm = useCallback(
		(values: UpdateUserDataDto) => {
			onSubmit({ ...values }, (field?: string) => {
				if (field === 'name') {
					setError('name', { type: 'Invelid name' });
				}
			});
		},
		[onSubmit, setError]
	);

	return (
		<Box component="form" onSubmit={handleSubmit(handleSubmitForm)} sx={formStyles}>
			<CoreTextField {...register('name')} label="Name" />

			<CoreButton type="submit">Submit</CoreButton>
		</Box>
	);
};
