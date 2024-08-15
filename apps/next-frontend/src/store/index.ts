import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import { sessionSlice } from '../modules/auth';
import { GetServerSidePropsContext } from 'next';
import { Config, Context, createWrapper } from 'next-redux-wrapper';
import { STAGE_NAME_TO_DISPLAY, StageNameEnum } from '../constants';
import { getSSRTokenPairFromCookies } from '@/modules/auth/utils/cookies.utils';
import { setTokenPair } from '@/modules/auth/store';
// should be last import
import api from './api';
import { ReloadPage } from '@/modules/_core/components/reload-page';

const isDevMode = STAGE_NAME_TO_DISPLAY as unknown !== StageNameEnum.PROD;

const makeStore = (context: Context) => {
	const store = configureStore({
		reducer: {
			session: sessionSlice.reducer,
			[api.reducerPath]: api.reducer,
		},
		// Adding the api middleware enables caching, invalidation, polling,
		// and other useful features of `rtk-query`.
		middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
		devTools: isDevMode,
	});

	// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
	// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
	setupListeners(store.dispatch);

	// Init store on SSR
	const ssrContext = context as GetServerSidePropsContext;

	if (ssrContext?.req) {
		const session = getSSRTokenPairFromCookies(ssrContext);
		store.dispatch(setTokenPair(session));
	}

	return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunkConfig = {
	state: RootState;
	dispatch: AppDispatch;
};

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const storeConfig: Config<AppStore> = {
	// debug: isDevMode,
	debug: false,
};

export const wrapper = createWrapper<AppStore>(makeStore, storeConfig);
