import React, { FC, useCallback } from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../hooks/use-page-title.hook';
import { useHeaderNav } from '../../hooks/use-header-nav.hook';
import { CoreHeaderWithBackButton } from '../_ui/core-header-with-back-button';
import { CoreHeaderContainer } from '../_ui/core-header-container';

export const PageTitle: FC = () => {
	const navigate = useNavigate();

	const title = usePageTitle();
	const nav = useHeaderNav();

	const handleNavigate = useCallback(() => {
		if (!nav) {
			return;
		}

		const { to } = nav;

		if (typeof to === 'number') {
			navigate(to);

			return;
		}

		navigate(to.path, to.options);
	}, [navigate, nav]);

	return (
		<CoreHeaderContainer smallPx={!!nav}>
			{!nav && (
				<Typography variant="h4" noWrap sx={{ minWidth: 210 }}>
					{title}
				</Typography>
			)}
			{nav && <CoreHeaderWithBackButton onBack={handleNavigate} header={title} />}
		</CoreHeaderContainer>
	);
};
