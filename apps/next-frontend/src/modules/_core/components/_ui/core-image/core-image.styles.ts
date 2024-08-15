import { SxProps, Theme } from "@mui/material";

export const imageWrapperStyle: SxProps<Theme> = {
	position: 'relative',
	display: "inline-block",
	overflow: "hidden",
	width: "100%",
	height: "100%",
};

export const imageStyle: SxProps<Theme> = {
	objectFit: "cover",
	objectPosition: 'center',
};
