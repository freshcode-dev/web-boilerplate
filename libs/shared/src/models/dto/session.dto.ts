export class SessionDto {
	id: string;
	tokenId: string;
	userId: string;
	rememberMe: boolean;
	expiredAt: Date;
	createdAt: Date;
	updatedAt: Date;
}
