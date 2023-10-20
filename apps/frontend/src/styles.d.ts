/**
 * @file Supposed to be used as a place to extend the default MUI theme typings
 */
import React from 'react';
import '@mui/material';

declare module '@mui/material/styles' {
	interface AppColors {
		bluePressed: React.CSSProperties['color'];
		redPressed: React.CSSProperties['color'];
		blueTransparentLight: React.CSSProperties['color'];
		blueTransparent: React.CSSProperties['color'];
		orange: React.CSSProperties['color'];
		blue: React.CSSProperties['color'];
		black: React.CSSProperties['color'];
		darkGray: React.CSSProperties['color'];
		gray: React.CSSProperties['color'];
		grayLight: React.CSSProperties['color'];
		divider: React.CSSProperties['color'];
		white: React.CSSProperties['color'];
		red: React.CSSProperties['color'];
		green: React.CSSProperties['color'];
	}

	interface ThemeOptions {
		colors: AppColors;
	}

	interface Theme {
		colors: AppColors;
	}

	interface TypographyVariants {
		p1: React.CSSProperties;
		labelMedium: React.CSSProperties;
		label: React.CSSProperties;
	}

	interface TypographyVariantsOptions {
		p1?: React.CSSProperties;
		labelMedium?: React.CSSProperties;
		label?: React.CSSProperties;
	}
}

declare module '@mui/material/Typography' {
	interface TypographyPropsVariantOverrides {
		p1: true;
		labelMedium: true;
		label: true;
	}
}
