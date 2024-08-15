import { FC } from 'react';
import { useRouter } from 'next/router';
import { IS_BROWSER } from '@/constants';

export const ReloadPage: FC = () => {
	const router = useRouter();

	if (IS_BROWSER) {
		// auth check is done inside 'router.server.utils.ts' module
		// if user is not authenticated, he will be redirected to login page
		// after login user will be redirected to the page he was trying to access
		router.reload();
	}

	return <div></div>;
};
