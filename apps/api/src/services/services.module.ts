import { Module } from '@nestjs/common';
import { DatabaseModule, modelsToInclude } from '@boilerplate/data';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
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
import { TwilioService } from './twillio.service';
import { LoggingModule } from '../core/logging/logging.module';
import { GoogleAuthService } from './google-auth.service';
import { MailerService } from './mailer.service';
import { OTPService } from './otp.service';
import { ExternalApisService } from './external.service';

@Module({
	imports: [
		DatabaseModule.forFeature(modelsToInclude),
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
		TwilioService,
		GoogleAuthService,
		MailerService,
		OTPService,
		ExternalApisService,
	],
	exports: [UsersService, AuthService, SessionsService, TwilioService, ExternalApisService],
})
export class ServicesModule {}
