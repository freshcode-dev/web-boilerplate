import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [
    TerminusModule,
    ServicesModule,
  ],
  controllers: [
    UsersController,
    HealthController
  ],
})
export class ControllersModule {}
