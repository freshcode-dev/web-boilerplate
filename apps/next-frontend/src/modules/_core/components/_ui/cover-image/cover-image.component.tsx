import { FC } from 'react';
import { CoreImage, CoreImageProps } from '../core-image';

export const CoverImage: FC<CoreImageProps> = (props) => {
	const { wrapperSx, imageSx } = props;

	return (
		<CoreImage
			{...props}
			wrapperSx={{
				width: '100%',
				display: 'block',
				height: '100%',

				borderRadius: 1,
				backgroundColor: (theme) => theme.palette.grey[200],
				...wrapperSx,
			}}
			imageSx={{
				objectFit: 'cover',
				objectPosition: 'center',
				...imageSx,
			}}
		/>
	);
};
