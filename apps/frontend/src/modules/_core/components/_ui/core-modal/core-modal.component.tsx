import React, { FC, ReactNode, useCallback } from 'react';
import {
	DialogProps, Dialog, Box, Theme, SxProps, Typography, ModalProps
} from '@mui/material';
import {
	containerStyles, closeIconStyles, scrollWrapperStyles, loaderWrapperStyles
} from './core-modal.styles';
import { Close } from '../../../constants/icons.constants';
import { CoreIconButton } from '../core-button';
import { CoreLoadingWall } from '../core-loading-wall';

export interface CoreModalProps extends DialogProps {
	containerSx?: SxProps<Theme>;
	titleSx?: SxProps<Theme>;
	bodySx?: SxProps<Theme>;
	paperSx?: SxProps<Theme>;
	headerComponent?: ReactNode;
	modalTitle?: string | null;
	closeDisabled?: boolean;
	loading?: boolean;
	modalWidth?: number;
	hideCloseIcon?: boolean;

	/**
	 * Called before canceling the modal to determine if it's allowed
	 */
	beforeClose?(): boolean;
}

export const CoreModal: FC<CoreModalProps> = (props) => {
	const {
		headerComponent,
		loading,
		closeDisabled,
		modalTitle,
		children,
		containerSx,
		onClose,
		bodySx,
		modalWidth = 700,
		hideCloseIcon,
		paperSx,
		titleSx,
		...modalProps
	} = props;

	const handleClose = useCallback(() => {
		onClose?.({}, 'escapeKeyDown');
	}, [onClose]);

	const dialogClose = useCallback<NonNullable<ModalProps['onClose']>>((event, action) => {
		if (closeDisabled) {
			return;
		}

		onClose?.(event, action);
	}, [onClose, closeDisabled]);

	return (
		<Dialog
			{...modalProps}
			onClose={dialogClose}
			fullWidth
			aria-labelledby={modalTitle ?? undefined}
			sx={[
				{
					'& .MuiDialog-container': {
						alignItems: 'center'
					}
				},
				({ breakpoints }) => ({
					[breakpoints.down('sm')]: {
						'& .MuiDialog-container': {
							alignItems: 'flex-end'
						}
					}
				})
			]}
			PaperProps={{
				sx: [
					{ maxWidth: modalWidth },
					({ breakpoints }) => ({
						[breakpoints.down('sm')]: {
							maxWidth: '100%',
							margin: 1,
							width: 'calc(100% - 16px)',
							maxHeight: 'calc(100% - 16px)'
						}
					}),
					...(Array.isArray(paperSx)
						? paperSx
						: [paperSx]),
				]
			}}
			slotProps={{
				backdrop: {
					sx: { bgcolor: 'rgba(10, 10, 10, 0.5)' }
				}
			}}
		>
			<Box
				sx={[
					...(Array.isArray(containerStyles)
						? containerStyles
						: [containerStyles]),
					({ breakpoints }) => ({
						[breakpoints.down('sm')]: {
							pt: 4,
						}
					}),
					...(Array.isArray(containerSx)
						? containerSx
						: [containerSx]),
				]}
			>
				{!hideCloseIcon && (
					<CoreIconButton
						sx={closeIconStyles}
						onClick={handleClose}
						disabled={closeDisabled}
					>
						<Close/>
					</CoreIconButton>
				)}
				{!headerComponent && modalTitle && (
					<Typography
						variant="h4"
						sx={[
							{ mb: 2, px: 4 },
							({ breakpoints }) => ({
								[breakpoints.down('sm')]: { px: 3 }
							}),
							...(Array.isArray(titleSx)
								? titleSx
								: [titleSx])
						]}
					>
						{modalTitle}
					</Typography>
				)}
				{headerComponent}
				<Box sx={loaderWrapperStyles}>
					<Box
						sx={[
							...(Array.isArray(scrollWrapperStyles)
								? scrollWrapperStyles
								: [scrollWrapperStyles]),
							({ breakpoints }) => ({
								[breakpoints.down('sm')]: {
									px: 3,
									pb: 3
								}
							}),
							...(Array.isArray(bodySx)
								? bodySx
								: [bodySx]),
						]}
					>
						{children}
					</Box>
					{loading && <CoreLoadingWall />}
				</Box>
			</Box>
		</Dialog>
	);
};
