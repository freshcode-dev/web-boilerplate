import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { ServicesModule } from '../services/services.module';
import { AuthController } from './auth.controller';
import { SessionsController } from './sessions.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
		ConfigModule,
		TerminusModule,
    ServicesModule,
  ],
  controllers: [
		AuthController,
    UsersController,
    HealthController,
		SessionsController
  ],
})
export class ControllersModule {}
