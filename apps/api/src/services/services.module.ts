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
import { UserProfile } from './profiles/user.profile';
import { SessionProfile } from './profiles/session.profile';
import { JwtRefreshGuard } from './guard/jwt-refresh.guard';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';

@Module({
	imports: [DatabaseModule.forFeature([User, Session]), PassportModule, JwtModule.register({})],
	providers: [
		UsersService,
		AuthService,
		JwtStrategy,
		JwtAuthGuard,
		SessionsService,
		TokensService,
		UserProfile,
		SessionProfile,
		JwtRefreshGuard,
		JwtRefreshStrategy
	],
	exports: [UsersService, AuthService, SessionsService],
})
export class ServicesModule {}
