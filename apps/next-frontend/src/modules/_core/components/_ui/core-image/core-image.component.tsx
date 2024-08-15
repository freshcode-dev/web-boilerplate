/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from 'react';
import Image, { ImageProps } from 'next/image';
import { Box, SxProps, Theme } from '@mui/material';
import { imageStyle, imageWrapperStyle } from './core-image.styles';
import { clsx } from '@/modules/_core/utils/style.utils';

export interface CoreImageProps extends Omit<ImageProps, 'alt'> {
	wrapperSx?: SxProps<Theme> | null;
	imageSx?: SxProps<Theme> | null;
	alt?: string;
}

export const CoreImage: FC<CoreImageProps> = (props) => {
	const { wrapperSx = null, imageSx = null, fill = true, alt = '', ...rest } = props;

	return (
		<Box component="span" sx={clsx(imageWrapperStyle, wrapperSx)}>
			<Box
				sx={clsx(imageStyle, imageSx)}
				component={(props: any) => <Image {...props} {...rest} alt={alt} fill={fill} />}
			/>
		</Box>
	);
};
