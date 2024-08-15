import { useIsMobile } from '@/modules/_core/hooks';
import { Typography } from '@mui/material';
import { CustomContentProps, SnackbarContent, closeSnackbar } from 'notistack';
import { forwardRef, useCallback } from 'react';
import { Check, Close, CloseLarge, InfoLarge } from '@/constants/icons.constants';
import { CoreIconButton } from '../core-button/core-icon-button.component';
import { CoreToastBody, CoreToastBodyContent } from './core-toast-body.component';
import { CoreToastIcon } from './core-toast-icon.component';
import { CoreToastText } from './core-toast-text.component';

interface CoreToastProps extends CustomContentProps {
	title?: string;
	maxContentWidth?: number | null;
}

const getIcon = (variant: string) => {
	switch (variant) {
		case 'error':
			return <CloseLarge />;
		case 'success':
			return <Check />;
		case 'info':
			return <InfoLarge />;
		case 'warning':
		case 'default':
		default:
			return <InfoLarge />;
	}
};

export const CoreToast = forwardRef<HTMLDivElement, CoreToastProps>((props, ref) => {
	const { id, message, variant, title, maxContentWidth, className } = props;
	const isMobile = useIsMobile();
	const handleClose = useCallback(() => {
		closeSnackbar(id);
	}, [id]);

	return (
		<SnackbarContent ref={ref} role="alert">
			<CoreToastBody variant={variant} sx={{ maxWidth: maxContentWidth }}>
				<CoreToastBodyContent>
					<CoreToastIcon variant={variant}>
						{getIcon(variant,)}
					</CoreToastIcon>
					<CoreToastText variant={variant}>
						{title && (
							<Typography
								variant={'subtitle1'}
								sx={{
									mb: message ? 1 : 0,
									color: 'inherit',
								}}
							>
								{title}
							</Typography>
						)}
						{message && (
							<Typography
								variant={'label'}
								sx={{ color: 'inherit', fontSize: 14 }}
							>
								{message}
							</Typography>
						)}
					</CoreToastText>
					{isMobile && (
						<CoreIconButton
							onClick={handleClose}
							sx={{
								ml: '18px',
								color: ({ colors }) => (variant === 'info' ? colors.black : colors.white),
							}}
						>
							<Close />
						</CoreIconButton>
					)}
				</CoreToastBodyContent>
				{!isMobile && (
					<CoreIconButton
						onClick={handleClose}
						sx={{
							ml: '18px',
							color: ({ colors }) => (variant === 'info' ? colors.black : colors.white),
						}}
					>
						<Close />
					</CoreIconButton>
				)}
			</CoreToastBody>
		</SnackbarContent>
	);
});

CoreToast.displayName = 'CoreToast';
