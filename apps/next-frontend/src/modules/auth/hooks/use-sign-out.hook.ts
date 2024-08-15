import { useCallback } from 'react';
import { useSignOutMutation } from '@/store/api/auth.api';
import { useCurrentRefreshTokenSelector } from '../store/session.slice';
import { useRouter } from 'next/router';

export const useSignOut = (reloadPage = true) => {
	const router = useRouter();

	const refreshToken = useCurrentRefreshTokenSelector();

	const [signOut] = useSignOutMutation();

	return useCallback(async () => {
		if (!refreshToken?.token) return;

		await signOut(refreshToken?.token);

		if (reloadPage) router.reload();
	}, [refreshToken?.token, reloadPage, router, signOut]);
};
