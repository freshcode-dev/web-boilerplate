import React, { FC, memo } from 'react';
import { Box, SxProps, Theme } from '@mui/material';

export type FadeSpinnerProps = {
	size?: number;
	color?: string;
	height?: number;
	width?: number;
	borderRadius?: number;
	sx?: SxProps<Theme>;
};

const animationName = 'SystemFadeSpinner';

export const FadeSpinner: FC<FadeSpinnerProps> = memo((props) => {
	const {
		size = 32,
		color = 'black',
		width = 4,
		height = 16,
		borderRadius = 2,
		sx
	} = props;

	const left = size / 2 - width / 2;
	const bottom = size / 2;

	return (
		<Box sx={{
			width: size,
			height: size,
			position: 'relative',
			...sx
		}}>
			{Array.from({ length: 8 }).map((_, index) => (
				<Box
					key={index}
					sx={{
						position: 'absolute',
						width,
						height: bottom,
						left,
						bottom,
						transformOrigin: 'bottom center',
						transform: `rotate(${index * 45}deg)`,
					}}
				>
					<Box
						sx={{
							width: '100%',
							height,
							borderRadius: `${borderRadius}px`,
							backgroundColor: color,
							animationFillMode: "both",
							animation: `${animationName} 1.2s ${index * 0.12}s infinite ease-in-out`
						}}
					/>
				</Box>
			))}
		</Box>
	);
});
