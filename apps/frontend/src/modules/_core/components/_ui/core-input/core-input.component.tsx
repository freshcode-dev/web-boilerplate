import { FC } from "react";
import { styled } from "@mui/material/styles";
import { OutlinedInput, OutlinedInputProps, SxProps, Theme } from "@mui/material";

export interface CoreInputProps {
	small?: boolean;
	fullWidth?: boolean;
	sx?: SxProps<Theme>;
}

export const CoreInput: FC<OutlinedInputProps & CoreInputProps> = styled(OutlinedInput, {
	shouldForwardProp: name => name !== 'small'
})<CoreInputProps>(({ theme, small }) => ({
	'& .MuiOutlinedInput-notchedOutline': {
		borderColor: theme.colors.blueTransparent,
	},
	'&:hover .MuiOutlinedInput-notchedOutline': {
		borderColor: theme.colors.black
	},
	'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
		borderColor: theme.colors.blue
	},
	'&.Mui-error .MuiOutlinedInput-notchedOutline': {
		borderColor: theme.colors.red
	},
	'&.Mui-disabled': {
		'.MuiOutlinedInput-notchedOutline': {
			borderColor: theme.colors.blueTransparent
		},
		'.MuiOutlinedInput-input': {
			WebkitTextFillColor: 'unset',

			'&::placeholder': {
				color: theme.colors.blueTransparent
			}
		}
	},
	'& .MuiOutlinedInput-input': {
		height: '22px',
		padding: `${small ? 7 : 13}px ${small ? 12 : 16}px`,
		fontSize: 14,
		fontWeight: 300,
		color: theme.colors.black,
		'&::placeholder': {
			opacity: 1,
			color: theme.colors.gray
		}
	},
	'& .MuiInputBase-inputMultiline': {
		padding: '0 0'
	},
	'&.MuiInputBase-multiline': {
		padding: '12px 16px'
	},
	'&.MuiInputBase-adornedStart': {
		paddingLeft: `${small ? 4 : 8}px`,
		'.MuiOutlinedInput-input': {
			paddingLeft: 12
		}
	}
}));
