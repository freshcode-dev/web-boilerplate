import { FC } from 'react';
import { Control, useController } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { CoreLabeledCheckbox, CoreLabeledCheckboxProps } from '@/modules/_core/components/_ui/core-labeled-checkbox';
import { NamespacesEnum } from '@/constants';

export interface RememberMeCheckboxProps extends CoreLabeledCheckboxProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: Control<any>;
	name: string;
	labelI18nKey?: string;
}

export const RememberMeCheckbox: FC<RememberMeCheckboxProps> = (props) => {
	const { name, control, labelI18nKey, ...restProps } = props;

	const controller = useController({
		control,
		name,
	});

	const [t] = useTranslation([NamespacesEnum.SignIn]);

	return (
		<CoreLabeledCheckbox
			{...restProps}
			{...controller.field}
			checked={controller.field.value}
			label={t(labelI18nKey ?? 'sign-in-form.remember-me')}
		/>
	);
};
