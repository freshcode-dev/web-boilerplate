import { useAppDispatch } from '../../../store';
import { useCallback } from 'react';
import { signOutAction } from '../store/actions/sign-out.action';

export const useSignOut = () => {
	const dispatch = useAppDispatch();

	return useCallback(() => {
		dispatch(signOutAction());
	}, [dispatch]);
};
