import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DatabaseMigrationService, DatabaseModule, User } from '@boilerplate/data';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IApiConfigParams } from '../../interfaces/api-config-params';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ControllersModule } from '../controllers.module';
import { UserFilter } from '@boilerplate/shared';

const testUsers = [
	{ email: 'test@test.com', password: '32', name: '3432', createdAt: new Date() },
	{ email: 'test2@test.com', password: '32', name: '3432', createdAt: new Date() },
];

describe('Users', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
				imports: [
					ControllersModule,
					DatabaseModule.forRootAsync({
						imports: [ConfigModule],
						useFactory: (configService: ConfigService<IApiConfigParams>) => ({
							type: 'postgres',
							host: configService.get('NX_DATABASE_HOST'),
							port: +configService.get('NX_DATABASE_PORT'),
							username: configService.get('NX_DATABASE_USERNAME'),
							password: configService.get('NX_DATABASE_PASSWORD'),
							database: configService.get('NX_TEST_DATABASE_NAME'),
							dropSchema: true
						}),
						inject: [ConfigService]
					})
				],
			})
			.compile();

		app = moduleRef.createNestApplication();
		const gamRepo = moduleRef.get<Repository<User>>(getRepositoryToken(User));
		const migrationsService = moduleRef.get<DatabaseMigrationService>(DatabaseMigrationService);

		await migrationsService.migrateAuto();
		await gamRepo.save(testUsers);

		const test = await gamRepo.find();
		console.log('test', test);

		await app.init();
	});
	describe('/GET Users', () => {
		it(`returns all records when no filters`, () =>
			request(app.getHttpServer())
				.get('/users')
				.expect(200)
				.expect((res) => {
					expect(res.body.length).toBe(testUsers.length);
				})
		);

		it(`returns 1 entry when age size is 1`, () =>
			request(app.getHttpServer())
				.get('/users')
				.query({pageSize: 1} as UserFilter)
				.expect(200)
				.expect((res) => {
					expect(res.body.length).toBe(1);
				})
		);
	});


	afterAll(async () => {
		await app.close();
	});
});

