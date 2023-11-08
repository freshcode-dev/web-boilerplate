import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ControllersModule } from './controllers/controllers.module';
import { DatabaseModule } from '@boilerplate/data';
import { ServicesModule } from './services/services.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { IApiConfigParams } from './interfaces/api-config-params';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { LoggingModule } from './core/logging/logging.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './core/logging/logger.interceptor';

const serveStatic = process.env.NX_SERVE_STATIC === 'true';
const databaseRejectUnauthorized = process.env.NX_DATABASE_REJECT_UNAUTHORIZED === 'true';

@Module({
  imports: [
		AutomapperModule.forRoot({
			strategyInitializer: classes()
		}),
    ConfigModule.forRoot(),
		LoggingModule,
		ServeStaticModule.forRoot({
			// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
			rootPath: (serveStatic ? path.resolve(process.env.NX_SERVE_STATIC_PATH || 'client') : null) as string,
		}),
		DatabaseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService<IApiConfigParams>) => ({
				type: 'postgres',
				host: configService.get('NX_DATABASE_HOST'),
				port: +configService.get('NX_DATABASE_PORT'),
				username: configService.get('NX_DATABASE_USERNAME'),
				password: configService.get('NX_DATABASE_PASSWORD'),
				database: configService.get('NX_DATABASE_NAME'),
        logging: configService.get('NX_DATABASE_ENABLE_LOGGING') === 'true',
				// ToDo: needs to be improved. Set to false because default RDS authority doesn't match allowed CA's list
				extra: {
					ssl: databaseRejectUnauthorized ? { rejectUnauthorized: false } : undefined
				}
			}),
			inject: [ConfigService]
		}),
    ServicesModule,
    ControllersModule,
  ],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: LoggerInterceptor,
		},
  ]
})
export class AppModule {}
