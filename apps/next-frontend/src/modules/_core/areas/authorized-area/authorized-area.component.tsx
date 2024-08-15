import React, { FC, PropsWithChildren, Suspense } from 'react';
import { Box, Paper } from '@mui/material';
import { CommonAreaProviders } from '../common-area-providers.component';
import { SuspenseSpinner } from '../../components/router-suspense';
import {
	authorizedLayoutContainerStyles,
	authorizedLayoutWrapperStyles,
	getAppContentWrapperStyles,
	getAppWrapperStyles,
	getMainPaperStyles,
	getMainStyles,
} from './authorized-area.styles';
import { UserRolesEnum } from '@boilerplate/shared';
import { useIsMobile } from '@/modules/_core/hooks';
import { LayoutType } from '@/modules/_core/types';
import { RequireAuthorized } from '@/modules/auth/components/require-auth/require-authorized.component';
import { useCheckAuth } from '@/modules/_core/hooks/use-check-auth.hook';

const AuthorizedLayout: FC<PropsWithChildren> = ({ children }) => {
	const isMobile = useIsMobile();

	const isFlatBottom = true;

	return (
		<Box sx={authorizedLayoutContainerStyles}>
			<Box sx={authorizedLayoutWrapperStyles}>
				<Box sx={getAppWrapperStyles(isMobile)}>
					<Box sx={getAppContentWrapperStyles(isFlatBottom)}>
						<Box component="main" sx={getMainStyles(isMobile, isFlatBottom)}>
							<Paper elevation={0} sx={getMainPaperStyles(isMobile)}>
								<Suspense fallback={<SuspenseSpinner full />}>{children}</Suspense>
							</Paper>
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

const AuthorizedArea: LayoutType = (props) => {
	const { children, pageProps } = props;

	useCheckAuth();

	return (
		<RequireAuthorized>
			<CommonAreaProviders pageProps={pageProps}>
				<AuthorizedLayout>{children}</AuthorizedLayout>
			</CommonAreaProviders>
		</RequireAuthorized>
	);
};

export default AuthorizedArea;
