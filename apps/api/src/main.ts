import { NestFactory } from '@nestjs/core';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as swStats from 'swagger-stats';
import * as winston from 'winston';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import AllExceptionsFilter from './exceptions-filters/all-exceptions.filter';
import BadRequestExceptionsFilter from './exceptions-filters/bad-request-exceptions.filter';
import * as Transport from 'winston-transport';

const rootLogger: Logger | null = new Logger('ApplicationRoot');

async function bootstrap(): Promise<void> {
  const transports: Transport[] = [];

  if (process.env.NODE_ENV === 'production') {
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          winston.format.json()
        ),
        level: 'debug'
      })
    );
  } else {
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike()
        ),
        level: 'debug'
      })
    );
  }

  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: WinstonModule.createLogger({
      transports,
    }),
  });

  const config = new DocumentBuilder()
    .setTitle('API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new BadRequestExceptionsFilter()
  );

  app.useGlobalPipes(
    new ValidationPipe({ transform: true })
  );

  app.setGlobalPrefix('api');

  app.use(swStats.getMiddleware({ swaggerSpec: document }));

  await app.listen(3000);
}

process
	.on('unhandledRejection', (reason, promise) => {
		if (rootLogger) {
			rootLogger.error('Unhandled Rejection at Promise', reason);
		} else {
			console.error(reason, 'Unhandled Rejection at Promise', promise);
		}
	}).on('uncaughtException', (reason) => {
		if (rootLogger) {
			rootLogger.error('Uncaught Exception thrown', reason);
		} else {
			console.error('Uncaught Exception thrown', reason);
		}

	process.exit(1);
});

bootstrap();
