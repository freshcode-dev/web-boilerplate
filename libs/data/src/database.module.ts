import { DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { User, Session, OTPEntity } from './models';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
	TypeOrmModuleAsyncOptions,
	TypeOrmModuleOptions
} from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { EntitySchema } from 'typeorm/entity-schema/EntitySchema';
import { DatabaseMigrationService } from './services';
import { DbMigration } from './models/db-migration.entity';

export const modelsToInclude = [
	DbMigration,
	User,
	Session,
	OTPEntity,
];

type DatabaseModuleOptions = TypeOrmModuleOptions & {
	entities: EntitySchema[];
};

export class DatabaseModule extends TypeOrmModule {
	public static forRootAsync(options: TypeOrmModuleAsyncOptions): DynamicModule {
		const oldUseFactory = options.useFactory;

		if (oldUseFactory) {
			options.useFactory = async (...args) => {
				const sourceOptions = await oldUseFactory(...args);

				return {
					...sourceOptions,
					entities: [
						...(sourceOptions?.entities as Array<EntitySchema> || []),
						...modelsToInclude
					]
				};
			};
		}

		const module = super.forRootAsync(options);

		return this.ExtendModuleWithCustomServices(module);
	}

	public static forRoot(options: DatabaseModuleOptions): DynamicModule {
		const module = super.forRoot({
			...options,
			entities: [
				...(options.entities || []),
				...modelsToInclude
			]
		});

		return this.ExtendModuleWithCustomServices(module);
	}

	private static ExtendModuleWithCustomServices(module: DynamicModule): DynamicModule {
		const servicesToAdd = [
			DatabaseMigrationService
		];

		return {
			...module,
			imports: [
				...(module.imports ?? []),
				ConfigModule
			],
			providers: [
				...(module.providers ?? []),
				...servicesToAdd
			],
			exports: [
				...(module.exports ?? []),
				...servicesToAdd
			]
		}
	}
}
