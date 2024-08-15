import { SxProps, Theme } from '@mui/material';

export const cardStyles: SxProps<Theme> = {
	mb: 3,
};

export const profileDataCategoryStyles: SxProps<Theme> = [
	{
		mt: 2,
		mb: 2,
	},
];

export const contactInfoRowStyles: SxProps<Theme> = [
	{
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: '1rem',
		marginBottom: '0.35em',
	},
];

export const contactInfoButtonStyles: SxProps<Theme> = [
	{
		p: '0.15rem 0.5rem',
		backgroundColor: '#fff',
		borderRadius: '0.5rem',
	},
];

export const subtitleStyles: SxProps<Theme> = [
	{
		borderBottom: '2px solid #bbb',
		marginBottom: 2,
	},
];
