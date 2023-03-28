import { UserDto } from './user.dto';

export interface TokenPairDto {
	refreshToken: string;
	accessToken: string;
}

export interface AuthResponseDto extends TokenPairDto {
	user: UserDto;
}

export interface RefreshDto {
	refreshToken: string;
}
