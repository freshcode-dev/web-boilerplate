import React, { FC, useCallback, useState } from 'react';
import { CoreButtonProps } from '../_ui/core-button';
import { CoreConfirmationModal, CoreConfirmationModalProps } from '../_ui/core-confirmation-modal';

type ButtonProps = Pick<CoreButtonProps, 'variant' | 'children' | 'sx' | 'type' | 'form'>;

type ConfirmationModalProps = CoreConfirmationModalProps & {
	leftButtonProps?: ButtonProps;
	rightButtonProps?: ButtonProps;
	onSubmit?(): Promise<void> | void;

	/**
	 * Called, when closing is initiated from inside the modal
	 */
	onClose?(): void;
	onHideCompleted?(): void;
};

/**
 * High-level wrapper over the CoreConfirmationModal. Controls async submission flow with loading
 */
export const ConfirmationModal: FC<ConfirmationModalProps> = (props) => {
	const {
		beforeClose,
		onClose,
		onSubmit,
		leftButtonProps,
		rightButtonProps,
		onHideCompleted,
		closeDisabled,
		...modalProps
	} = props;

	const [submitting, setSubmitting] = useState(false);


	const handleClose = useCallback(async () => {
		const modalCanBeClosed = beforeClose ? beforeClose() : true;

		if (!modalCanBeClosed) {
			return;
		}

		onClose?.();
		onHideCompleted?.();
	}, [onClose, onHideCompleted]);

	const handleSubmit = useCallback(async () => {
		setSubmitting(true);
		await onSubmit?.();
		setSubmitting(false);
		onHideCompleted?.();
	}, [onHideCompleted, onSubmit]);

	return (
		<CoreConfirmationModal
			{...modalProps}
			onClose={handleClose}
			closeDisabled={submitting || closeDisabled}
			leftButtonProps={{
				...leftButtonProps,
				disabled: submitting || closeDisabled,
				onClick: handleClose,
			}}
			rightButtonProps={{
				...rightButtonProps,
				loading: submitting,
				onClick: handleSubmit
			}}
		/>
	);
};
