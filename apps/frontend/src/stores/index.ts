import { SessionStore } from './SessionStore';
import { usersService } from '../data-services';

export const sessionStore = new SessionStore(usersService);
