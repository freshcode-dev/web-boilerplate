import { SxProps } from '@mui/material';
import { Theme } from '@mui/material/styles';

export const selectPaperStyles: SxProps<Theme> = {
	border: 1,
	borderColor: theme => theme.colors.blueTransparent,
	boxShadow: '0px 4px 4px rgba(68, 71, 77, 0.08)',
	marginTop: '4px'
};

export const selectCheckboxStyles: SxProps<Theme> = {
	// marginLeft: '-13px',
	marginRight: '14px',
	padding: '0'
};
