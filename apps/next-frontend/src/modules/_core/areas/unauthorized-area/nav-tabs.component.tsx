import { AuthRoutes, SIGN_IN_CACHE_KEY, VERIFY_CACHE_KEY } from '@/modules/auth/constants';
import { useSendOtpMutation, useSignInWithPhoneMutation } from '@/store/api/auth.api';
import { useTranslation } from 'next-i18next';
import { FC, useMemo } from 'react';
import { CoreNavTabs, NavTab } from '../../components/_ui/core-nav-tabs';
import { activeSxTab, sxTab } from './unauthorized-area.styles';

export const NavTabs: FC = () => {
	const [t] = useTranslation();

	const [, { isLoading: signingInWithPhone }] = useSignInWithPhoneMutation({
		fixedCacheKey: SIGN_IN_CACHE_KEY,
	});

	const [, { isLoading: verifying }] = useSendOtpMutation({
		fixedCacheKey: VERIFY_CACHE_KEY,
	});

	const disableTabs = signingInWithPhone || verifying;

	const tabs = useMemo<NavTab[]>(
		() => [
			{
				to: AuthRoutes.LoginPhone,
				label: t('nav.sign-in-with-phone'),
				id: 'auth-sign-in-phone-panel',
				disabled: disableTabs,
				sx: sxTab,
				activeSx: activeSxTab,
			},
			{
				to: AuthRoutes.SignUp,
				label: t('nav.sign-up'),
				id: 'auth-sign-up-panel',
				disabled: disableTabs,
				sx: sxTab,
				activeSx: activeSxTab,
			},
		],
		[t, disableTabs]
	);

	return (
		<CoreNavTabs
			tabs={tabs}
			tabIndicatorSx={(currentTab) => ({
				display: 'none',
			})}
			tabsStyles={{
				'& .MuiTabs-flexContainer': {
					border: '1px solid',
					borderColor: '#EBF5FF',
					borderRadius: '100px',
				},
			}}
		/>
	);
};
