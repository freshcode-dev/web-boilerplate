import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  TypeOrmHealthIndicator
} from '@nestjs/terminus';
import { Connection } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(
      private readonly connection: Connection,
      private readonly healthCheckService: HealthCheckService,
      private readonly typeOrmHealthIndicator: TypeOrmHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  public async check(): Promise<HealthCheckResult> {
    return await this.healthCheckService.check([
      async () => this.typeOrmHealthIndicator.pingCheck('database', { timeout: 1500, connection: this.connection })
    ]);
  }
}
