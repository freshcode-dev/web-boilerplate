import { useContext } from 'react';
import { GlobalStoreContext } from '../contexts';

const useMobxStoreHook = () => useContext(GlobalStoreContext);
export default useMobxStoreHook;
