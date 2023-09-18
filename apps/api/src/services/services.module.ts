import { Module } from '@nestjs/common';
import { DatabaseModule, Session, User } from '@boilerplate/data';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtAuthGuard } from './guard/jwt.guard';
import { SessionsService } from './sessions.service';
import { TokensService } from './tokens.service';
import { JwtRefreshGuard } from './guard/jwt-refresh.guard';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { UserProfile } from './profiles/user.profile';

@Module({
	imports: [DatabaseModule.forFeature([User, Session]), PassportModule, JwtModule.register({})],
	providers: [
		UserProfile,
		UsersService,
		AuthService,
		JwtStrategy,
		JwtAuthGuard,
		SessionsService,
		TokensService,
		JwtRefreshGuard,
		JwtRefreshStrategy
	],
	exports: [UsersService, AuthService, SessionsService],
})
export class ServicesModule {}
