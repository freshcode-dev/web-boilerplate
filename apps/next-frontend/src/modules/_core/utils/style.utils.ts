import { SxProps, Theme } from '@mui/material';

type SxType = SxProps<Theme> | undefined | null;

export const clsx = (...args: SxType[]): SxProps<Theme> =>
	args.map((arg) => (Array.isArray(arg) ? arg : arg ? [arg] : [])).flat(3);
