import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ControllersModule } from './controllers/controllers.module';
import { LoggerMiddleware } from './core/logging/logger.middleware';
import { DatabaseModule } from '@boilerplate/data';
import { ServicesModule } from './services/services.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { IApiConfigParams } from './interfaces/api-config-params';

const serveStatic = process.env.NX_SERVE_STATIC === 'true';

@Module({
  imports: [
    ConfigModule.forRoot(),
		ServeStaticModule.forRoot({
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
			}),
			inject: [ConfigService]
		}),
    ServicesModule,
    ControllersModule,
  ]
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware)
        .forRoutes('*');
  }
}
