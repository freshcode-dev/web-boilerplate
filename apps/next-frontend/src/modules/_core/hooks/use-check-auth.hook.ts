import { useCurrentRefreshTokenSelector } from '@/modules/auth/store';
import { useGetCurrentSessionQuery } from '@/store/api/sessions.api';

export const useCheckAuth = () => {
	const refreshToken = useCurrentRefreshTokenSelector();

	useGetCurrentSessionQuery({
		refreshToken: refreshToken?.token as string,
	});
};
