import { UserRolesEnum } from '../enums';

export interface JwtPayload {
	sub: string;
	payload: {
		userRoleId: UserRolesEnum;
	};
	jti: string;
	iat: number;
}
