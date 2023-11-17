import { useCallback } from 'react';
import { useSignOutMutation } from '../../../store/api/auth.api';
import { useCurrentRefreshTokenSelector } from '../store/session.slice';

export const useSignOut = () => {
	const refreshToken = useCurrentRefreshTokenSelector();

	const [signOut] = useSignOutMutation();

	return useCallback(async () => {
		if (!refreshToken?.token) return;

		await signOut(refreshToken?.token);
	}, [refreshToken?.token, signOut]);
};
