import React, { FC, ReactNode, memo, useMemo } from 'react';
import { Divider, Box, List, ListItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { DrawerBase, DrawerLogo } from './drawer-base.component';
import { PanelOpen, PanelClose } from '../../../constants/icons.constants';
import { DrawerButton } from './drawer-button.component';
import { MatchedDrawerButton } from './matched-drawer-button.component';

export interface DrawerLink {
	label: string;
	route: string;
	icon?: ReactNode;
	activeIcon?: ReactNode;
	hidden?: boolean;
}

interface CoreDrawerProps {
	open: boolean;
	logoLink?: string;
	links: DrawerLink[];
	footer?: ReactNode;
	onToggle?(): void;
}

export const CoreDrawer: FC<CoreDrawerProps> = memo((props) => {
	const { open, onToggle, links, footer, logoLink } = props;

	const { t } = useTranslation();

	const ToggleIcon = open ? <PanelClose /> : <PanelOpen />;

	const filteredMenuLinks = useMemo(() => links.filter((link) => !link.hidden), [links]);

	return (
		<Box component="nav">
			<DrawerBase open={open} variant="permanent">
				<Box
					sx={{
						height: 72,
						width: '100%',
						display: 'flex',
						flexShrink: 0,
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Link to={logoLink ?? '/'}>
						<DrawerLogo open={open} />
					</Link>
				</Box>
				<Divider />
				<List
					sx={{
						overflowY: 'auto',
						overflowX: 'hidden',
						flexGrow: 1,
						px: 1,
						pb: 2,
						pt: 3,
					}}
				>
					{filteredMenuLinks.map(({ route, label, icon, activeIcon }) => (
						<ListItem key={route} disablePadding>
							<MatchedDrawerButton collapsed={!open} icon={icon} activeIcon={activeIcon} to={route}>
								{label}
							</MatchedDrawerButton>
						</ListItem>
					))}
				</List>
				<Box
					sx={{
						pb: 1,
						px: 1,
					}}
				>
					{open ? footer : null}
					<DrawerButton onClick={onToggle} icon={ToggleIcon} collapsed={!open}>
						{t('nav.close-menu')}
					</DrawerButton>
				</Box>
			</DrawerBase>
		</Box>
	);
});
