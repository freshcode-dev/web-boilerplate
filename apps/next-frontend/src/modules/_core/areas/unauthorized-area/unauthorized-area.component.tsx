import { RequireUnauthorized } from '@/modules/auth/components/require-unauthorized/require-unauthorized.component';
import { Box, Container, Grid, Typography } from '@mui/material';
import { RootRoutes } from '@/constants';
import { Trans, useTranslation } from 'next-i18next';
import Link from 'next/link';
import { FC, PropsWithChildren } from 'react';
import { theme } from 'src/theme/theme';
import { CoreLinkButton } from '../../components/_ui/core-button';
import { CoverImage } from '../../components/_ui/cover-image';
import { CommonAreaProviders } from '../common-area-providers.component';
import { NavTabs } from './nav-tabs.component';
import {
	authContainerStyles,
	changePhoneContactStyles,
	contentStyles,
	coverImageContainerStyles,
	gridContainerStyles,
	headerStyles,
	outletContainerStyles,
	paperStyles,
	tabsStyles,
} from './unauthorized-area.styles';
import { Images } from 'src/constants/images.constants';
import { LayoutType } from '@/modules/_core/types';

const UnauthorizedLayout: FC<PropsWithChildren> = ({ children }) => {
	const [t] = useTranslation();

	return (
		<Grid component="main" container columnSpacing={1} sx={gridContainerStyles}>
			<Grid component="article" item xs={12} md={6} sx={authContainerStyles}>
				<Box sx={paperStyles}>
					<Box sx={contentStyles}>
						<Box sx={headerStyles}>
							<Link href={RootRoutes.Root}>
								LOGO
							</Link>
							{/* <SystemLanguageSwitcher /> */}
						</Box>

						<Box sx={tabsStyles}>
							<NavTabs />
						</Box>

						<Container sx={outletContainerStyles}>{children}</Container>
					</Box>
					<Typography variant="label" sx={changePhoneContactStyles}>
						<Trans
							sx={changePhoneContactStyles}
							i18nKey={t('auth-change-phone-contact')}
							components={[
								<CoreLinkButton
									key="0"
									sx={{
										font: 'inherit',
										color: 'inherit',
										textDecoration: 'none',
										':hover': {
											color: theme.colors.blueTransparent,
										},
									}}
									to={`mailto:${t('auth-change-phone-contact').match(/<0>(.*?)<\/0>/)?.[1] ?? ''}`}
								/>,
							]}
						/>
					</Typography>
				</Box>
			</Grid>

			<Grid item xs={6} sx={coverImageContainerStyles}>
				<CoverImage priority
										src={Images.PortalCover}
										alt="cover image"
										sizes={`50vw`}
										wrapperSx={{ borderRadius: 2 }}
										imageSx={{ filter: 'blur(8px)'}} />
			</Grid>
		</Grid>
	);
};

const UnauthorizedArea: LayoutType = (props) => {
	const { children, pageProps } = props;

	return (
		<RequireUnauthorized>
			<CommonAreaProviders pageProps={pageProps}>
				<UnauthorizedLayout>{children}</UnauthorizedLayout>
			</CommonAreaProviders>
		</RequireUnauthorized>
	);
};

export default UnauthorizedArea;
