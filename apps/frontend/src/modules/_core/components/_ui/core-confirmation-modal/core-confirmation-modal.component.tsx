import React, { FC, ReactNode } from 'react';
import { IconCircle } from '../icon-circle';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { CoreModal, CoreModalProps } from '../core-modal';
import { CoreButton, CoreButtonProps } from '../core-button';

export type CoreConfirmationModalProps = CoreModalProps & {
	icon?: ReactNode;
	danger?: boolean;
	title?: string | null;
	description?: string | null;
	leftButtonProps?: CoreButtonProps;
	hideControls?: boolean;
	rightButtonProps?: CoreButtonProps;
	minButtonWidth?: number;
};

/**
 * Standardized but pretty customizable confirmation modal.
 * Should be used for most confirmation modal windows in the system
 */
export const CoreConfirmationModal: FC<CoreConfirmationModalProps> = (props) => {
	const {
		icon,
		danger,
		description,
		leftButtonProps,
		rightButtonProps,
		hideControls,
		title,
		minButtonWidth = 190,
		...modalProps
	} = props;

	const theme = useTheme();
	const smallSize = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<CoreModal
			{...modalProps}
			containerSx={[
				({ breakpoints }) => ({
					[breakpoints.down('sm')]: { pt: 3 }
				})
			]}
			bodySx={{ pt: 0 }}
		>
			<>
				<Box
					sx={[
						{
							display: 'flex',
							alignItems: 'center',
							flexDirection: 'column',
							mb: 2
						},
						({ breakpoints }) => ({
							[breakpoints.down('sm')]: { mb: 1 }
						})
					]}
				>
					<IconCircle danger={danger}>
						{icon}
					</IconCircle>
				</Box>
				{title && (
					<Typography
						variant="h3"
						sx={[
							{
								textAlign: 'center',
								mb: description ? 2 : 0
							},
							({ breakpoints }) => ({
								[breakpoints.down('sm')]: { mb: description ? 1 : 0 }
							})
						]}
					>
						{title}
					</Typography>
				)}
				{description && (
					<Typography variant="body1" sx={{ textAlign: 'center' }}>
						{description}
					</Typography>
				)}
				{!hideControls && (
					<Box
						sx={[
							{ display: 'flex', justifyContent: 'center', mt: 3 },
							({ breakpoints }) => ({
								[breakpoints.down('sm')]: {
									mt: 2,
									flexDirection: 'column-reverse',
									alignItems: 'center'
								}
							})
						]}
					>
						<Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
							<CoreButton
								sx={{
									minWidth: minButtonWidth,
									mr: !smallSize ? 1.5 : 0,
									...leftButtonProps?.sx
								}}
								{...leftButtonProps}
							/>
						</Box>
						<Box sx={{ display: 'flex', flex: 1, mb: smallSize ? 2 : 0 }}>
							<CoreButton
								sx={{
									minWidth: minButtonWidth,
									ml: !smallSize ? 1.5 : 0,
									...rightButtonProps?.sx
								}}
								{...rightButtonProps}
							/>
						</Box>
					</Box>
				)}
			</>
		</CoreModal>
	);
};
