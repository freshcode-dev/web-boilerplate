import { FC, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { STAGE_NAME_TO_DISPLAY, StageNameEnum } from '@/constants';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { useMatch } from '@/modules/_core/hooks';

export const SystemStageBanner: FC = () => {
	const is404 = !!useMatch('/404');

	const [isOpen, setIsOpen] = useState<boolean>(!is404);

	const [t] = useTranslation();

	const handleClose = () => {
		setIsOpen(false);
	};

	return STAGE_NAME_TO_DISPLAY as unknown === StageNameEnum.PROD ? null : (
		<Box
			sx={{
				display: isOpen ? 'flex' : 'none',
				position: 'fixed',
				bottom: 0,
				right: 0,
				left: 0,
				minHeight: 40,
				backgroundColor: 'warning.main',
				color: 'white',
				px: 2,
				py: 1,
				zIndex: (theme) => theme.zIndex.snackbar,
				justifyContent: 'center',
				alignItems: 'center',
				columnGap: 1,
			}}
		>
			<Box
				sx={{
					flexGrow: 1,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Box
					sx={{
						fontSize: '12px',
						fontWeight: '500',
						userSelect: 'none',
					}}
				>
					{t('stage-banner-text', { stage: STAGE_NAME_TO_DISPLAY })}
				</Box>
			</Box>
			<IconButton
				disableRipple={false}
				onClick={handleClose}
				sx={{
					color: 'white',
					cursor: 'pointer',
				}}
			>
				<CloseRounded
					sx={{
						fontSize: '16px',
					}}
				/>
			</IconButton>
		</Box>
	);
};
