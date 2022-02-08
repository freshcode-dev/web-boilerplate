import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ControllersModule } from './controllers/controllers.module';
import { LoggerMiddleware } from './core/logging/logger.middleware';
import { ConfigParamsEnum, DatabaseModule } from '@boilerplate/data';
import { ServicesModule } from './services/services.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

const serveStatic = process.env.NX_SERVE_STATIC === 'true';

@Module({
  imports: [
    ConfigModule.forRoot(),
		ServeStaticModule.forRoot({
			rootPath: serveStatic ? path.resolve(process.env.NX_SERVE_STATIC_PATH || 'client') : null,
		}),
		DatabaseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get<string>(ConfigParamsEnum.DATABASE_HOST),
				port: configService.get<number>(ConfigParamsEnum.DATABASE_PORT),
				username: configService.get<string>(ConfigParamsEnum.DATABASE_USERNAME),
				password: configService.get<string>(ConfigParamsEnum.DATABASE_PASSWORD),
				database: configService.get<string>(ConfigParamsEnum.DATABASE_NAME),
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
