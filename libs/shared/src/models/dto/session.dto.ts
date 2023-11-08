export class SessionDto {
	id: string;
	tokenId: string;
	userId: string;
	rememberMe: boolean;
	ipAddress: string;
	userAgent: string;
	expiredAt: Date;
	createdAt: Date;
	updatedAt: Date;
}
