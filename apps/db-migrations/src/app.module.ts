import { Module } from '@nestjs/common';
import { DatabaseModule } from '@boilerplate/data';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IMigrationsConfigParams } from './interfaces/config-params';

@Module({
	imports: [
		ConfigModule.forRoot(),
		DatabaseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService<IMigrationsConfigParams>) => ({
				type: 'postgres',
				host: configService.get('NX_DATABASE_HOST'),
				port: +configService.get('NX_DATABASE_PORT'),
				username: configService.get('NX_DATABASE_USERNAME'),
				password: configService.get('NX_DATABASE_PASSWORD'),
				database: configService.get('NX_DATABASE_NAME'),
				logging: configService.get('NX_DATABASE_ENABLE_LOGGING') === 'true',
			})
		})
	]
})
export class AppModule {

}
