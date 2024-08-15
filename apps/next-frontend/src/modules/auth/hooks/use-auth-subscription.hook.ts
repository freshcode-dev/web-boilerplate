import { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { syncSessionAction } from '../store';
import { AUTH_KEYS_LIST, IS_BROWSER } from '@/constants';

// https://developer.mozilla.org/en-US/docs/Web/API/CookieChangeEvent
interface CookieChangeEvent {
	type: 'change';

	changed: {
		name: string;
		value: string;
		expires: number | null;
		domain: string | null;
		path: string;
		secure: boolean;
		partiioned: boolean;
		sameSite: 'strict' | 'lax' | 'none';
	}[];

	deleted: {
		name: string;
		value: string;
		expires: number | null;
		domain: string | null;
		path: string;
		secure: boolean;
		partiioned: boolean;
		sameSite: 'strict' | 'lax' | 'none';
	}[];
}

export const useAuthSubscription = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!IS_BROWSER) return;

		// @ts-expect-error non-standard key
		if (!window['cookieStore']) {
			console.warn('Cookie store is not available');

			return;
		}

		// https://developer.mozilla.org/en-US/docs/Web/API/CookieChangeEvent#examples

		const handler = (event: CookieChangeEvent) => {
			const { changed, deleted } = event;

			const name = changed[0]?.name ?? deleted[0]?.name;

			if (AUTH_KEYS_LIST.includes(name ?? '')) {
				dispatch(syncSessionAction());
			}
		};

		// @ts-expect-error non-standard key
		window['cookieStore'].addEventListener('change', handler);

		return () => {
			// @ts-expect-error non-standard key
			window['cookieStore'].removeEventListener('change', handler);
		};
	}, [dispatch]);
};
