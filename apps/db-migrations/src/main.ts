import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import * as winston from "winston";
import { AppModule } from './app.module';
import { DatabaseMigrationService } from '@boilerplate/data';


async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: WinstonModule.createLogger({
			transports: [
				new winston.transports.Console({
					format: winston.format.combine(
						winston.format.timestamp(),
						winston.format.ms(),
						winston.format.json()
					),
					level: 'debug'
				})
			],
		}),
	});

	const databaseMigrationService = await app.get(DatabaseMigrationService);
	await databaseMigrationService.migrateAuto();

	await app.close();
	await process.exit();
}

bootstrap();
