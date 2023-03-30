import { argon2id } from 'argon2';

export const jwtConstants = {
	accessTokenSecret: 'accessTokenSecret',
	accessTokenExpiresIn: '15min',
	refreshTokenSecret: 'refreshTokenSecret',
	refreshTokenExpiresIn: '72h',
};

/**
 * See argon2
 * [recommended configuration]{@link https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id}
 */
export const argon2DefaultConfig = {
	timeCost: 2,
	parallelism: 1,
	memoryCost: 19456,
	type: argon2id,
};

export enum DbErrorCodes {
	UniqueViolation = '23505'
}
