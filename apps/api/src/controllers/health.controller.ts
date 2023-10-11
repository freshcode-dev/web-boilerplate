import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  TypeOrmHealthIndicator
} from '@nestjs/terminus';
import { Connection } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { IApiConfigParams } from '../interfaces/api-config-params';

@Controller('health')
export class HealthController {
  constructor(
      private readonly connection: Connection,
      private readonly healthCheckService: HealthCheckService,
      private readonly typeOrmHealthIndicator: TypeOrmHealthIndicator,
			private readonly configService: ConfigService<IApiConfigParams>
  ) {}

  @Get()
  @HealthCheck()
  public async check(): Promise<HealthCheckResult> {
		const databaseTimeout = +this.configService.getOrThrow('NX_DATABASE_HEALTHCHECK_TIMEOUT');

    return await this.healthCheckService.check([
      async () => this.typeOrmHealthIndicator.pingCheck('database', {
				timeout: databaseTimeout,
				connection: this.connection
			})
    ]);
  }
}
