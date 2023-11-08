import { Module } from '@nestjs/common';
import { DatabaseModule, Session, User } from '@boilerplate/data';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
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
import { PhoneVerificationService } from './phone-verification.service';
import { LoggingModule } from '../core/logging/logging.module';
import { GoogleAuthService } from './google-auth.service';

@Module({
	imports: [
		DatabaseModule.forFeature([User, Session]),
		PassportModule,
		LoggingModule,
		ConfigModule,
		JwtModule.register({}),
	],
	providers: [
		UserProfile,
		UsersService,
		AuthService,
		JwtStrategy,
		JwtAuthGuard,
		SessionsService,
		TokensService,
		JwtRefreshGuard,
		JwtRefreshStrategy,
		PhoneVerificationService,
		GoogleAuthService,
	],
	exports: [UsersService, AuthService, SessionsService, PhoneVerificationService],
})
export class ServicesModule {}
