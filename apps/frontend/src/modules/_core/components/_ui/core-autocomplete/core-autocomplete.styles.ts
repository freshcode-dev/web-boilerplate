import { SxProps, Theme } from '@mui/material';

export const coreAutocompleteStyles: SxProps<Theme> = {
	'& .MuiOutlinedInput-root .MuiAutocomplete-input': {
		padding: '8px 16px'
	},

	'& .MuiAutocomplete-inputRoot': {
		paddingLeft: 0,
		paddingBottom: '5px',
		paddingTop: '5px',

		'&.Mui-focused': {
			'.MuiAutocomplete-clearIndicator': {
				color: theme => theme.colors.black
			}
		},

		'.MuiAutocomplete-popupIndicator, .MuiAutocomplete-clearIndicator': {
			padding: '6px',
			color: theme => theme.colors.gray,

			'&.MuiAutocomplete-popupIndicatorOpen': {
				color: theme => theme.colors.black
			},

			'&:hover': {
				backgroundColor: theme => theme.colors.blueTransparentLight
			},
		}
	}
};

export const autocompleteCheckboxStyles: SxProps<Theme> = {
	// marginLeft: '-13px',
	marginRight: '14px',
	padding: '0'
};

