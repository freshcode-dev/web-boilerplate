import { createContext, useContext } from 'react';
import { GlobalStore } from '../stores';

export const GlobalStoreContext = createContext(GlobalStore);

export const GlobalStoreContextProvider = GlobalStoreContext.Provider;

export const useMobxStores = () => useContext(GlobalStoreContext);
