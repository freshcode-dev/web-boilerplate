import { useEffect } from 'react';
import { useAppDispatch } from '../../../store';
import { syncSessionAction } from '../store/actions/sync-session.action';
import { AUTH_KEYS_LIST } from '../../_core/constants';

export const useAuthSubscription = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		const handler = (event: StorageEvent) => {
			const { key } = event;

			if (AUTH_KEYS_LIST.includes(key || '')) {
				dispatch(syncSessionAction());
			}
		};

		window.addEventListener('storage', handler);

		return () => {
			window.removeEventListener('storage', handler);
		};
	}, [dispatch]);
};
