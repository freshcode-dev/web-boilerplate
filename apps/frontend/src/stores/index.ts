import { SessionStore } from './session.store';
import { usersService } from '../data-services';

export const sessionStore = new SessionStore(usersService);

export const GlobalStore: GlobalStoreInterface = {
  session: sessionStore
};

export interface GlobalStoreInterface {
  session: SessionStore;
}
