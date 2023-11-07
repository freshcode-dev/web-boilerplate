import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
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
import { PhoneVerificationService } from './phone-verification.service';
import { LoggingModule } from '../core/logging/logging.module';
import { GoogleAuthService } from './google-auth.service';
import { ExternalApisService } from './external.service';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule,
		DatabaseModule.forFeature([User, Session]),
		PassportModule,
		LoggingModule,
		ConfigModule,
		JwtModule.register({}),
		HttpModule
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
		ExternalApisService
	],
	exports: [UsersService, AuthService, SessionsService, PhoneVerificationService, ExternalApisService],
})
export class ServicesModule {}
