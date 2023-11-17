import { Theme, useMediaQuery } from '@mui/material';

export function useIsMobile() {
	const mediaDowmMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

	return mediaDowmMd;
}
