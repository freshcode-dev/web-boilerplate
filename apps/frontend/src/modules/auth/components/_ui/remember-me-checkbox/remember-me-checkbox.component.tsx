import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Control, useController } from 'react-hook-form';
import { CoreLabeledCheckbox, CoreLabeledCheckboxProps } from '../../../../_core/components/_ui/core-labeled-checkbox';

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

	const [t] = useTranslation();

	return (
		<CoreLabeledCheckbox
			{...restProps}
			{...controller.field}
			checked={controller.field.value}
			label={t(labelI18nKey ?? 'sign-in.sign-in-form.remember-me')}
		/>
	);
};
