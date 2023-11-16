import { FC, ImgHTMLAttributes } from 'react';
import { styled } from '@mui/material/styles';

export const CoverImage: FC<ImgHTMLAttributes<HTMLImageElement>> = styled('img')(({ theme }) => ({
	width: '100%',
	display: 'block',
	height: '100%',
	objectFit: 'cover',
	objectPosition: 'center',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: theme.palette.grey[200],
}));
