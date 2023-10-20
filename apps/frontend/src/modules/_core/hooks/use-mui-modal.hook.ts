import { ComponentType, useCallback, useRef } from 'react';
import { ShowFnOutput, useModal } from 'mui-modal-provider';
import { UseModalOptions } from 'mui-modal-provider/dist/use-modal';
import { ModalComponentProps, Options, Props } from 'mui-modal-provider/dist/types';

/**
 * Controller for modal window component lifecycle.
 * Takes any component with "open" prop, and provides imperative methods to control it
 * @example
 * // Init confirmation modal and get methods to control it
 * const { openModal, closeModal, updateCurrentModal } = useMuiModal(ConfirmationModal);
 * @example
 * // Open the modal with initial props
 * openConfirmationModal({ closeDisabled: true, header: 'Demo title' });
 * @example
 * // Update active modal with new props
 * updateConfirmationModal({ closeDisabled: false });
 */
export const useMuiModal = <P extends Props>(component: ComponentType<P>, options?: UseModalOptions) => {
	const { showModal, ...rest } = useModal(options);
	const modalRef = useRef<ShowFnOutput<P>>();
	const isOpen = useRef(false);

	const closeModal = useCallback(() => {
		modalRef.current?.destroy();
		isOpen.current = false;
	}, []);

	const openModal = useCallback(
		(props?: ModalComponentProps<P>, options?: Options) => {
			modalRef.current = showModal(component, props, options);
			isOpen.current = true;
		},
		[component, showModal]
	);

	const updateCurrentModal = useCallback((props: Partial<ModalComponentProps<P>>) => {
		modalRef.current?.update(props);
	}, []);

	return {
		isOpen,
		openModal,
		closeModal,
		updateCurrentModal,
		modalRef,
		...rest,
	};
};

export default useMuiModal;
