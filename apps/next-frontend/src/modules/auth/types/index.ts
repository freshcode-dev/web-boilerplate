import { JwtPayload } from '@boilerplate/shared';

export interface TokenWithPayload {
	token: string;
	payload: JwtPayload;
}


export interface TokenPairWithPayload {
	access: TokenWithPayload;
	refresh: TokenWithPayload;
}

export interface TokenPair {
	access: null;
	refresh: null;
}

export type SessionStateTokenPair = TokenPairWithPayload | TokenPair;
