import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { ServicesModule } from '../services/services.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    TerminusModule,
    ServicesModule,
  ],
  controllers: [
		AuthController,
    UsersController,
    HealthController
  ],
})
export class ControllersModule {}
