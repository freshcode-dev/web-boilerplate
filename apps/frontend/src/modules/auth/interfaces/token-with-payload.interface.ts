import { JwtPayload } from 'jwt-decode';

export interface TokenWithPayload {
	token: string;
	payload: JwtPayload;
}
