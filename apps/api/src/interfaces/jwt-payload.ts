export interface JwtPayload {
	sub: string;
	jti: string;
	iat: number;
	exp: number;
}
