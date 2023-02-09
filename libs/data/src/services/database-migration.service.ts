import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Connection, In, QueryRunner, Table } from 'typeorm';
import { Umzug, MigrationMeta, InputMigrations } from 'umzug';
import { MigrationContext } from '../utility-types';
import { TypeOrmUmzugStorage } from './type-orm-umzug.storage';
import { ConfigService } from '@nestjs/config';
import migrations from '../migrations';
import { DbMigration } from '../models/db-migration.entity';
import { IDatabaseConfigParams } from '../interfaces';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class DatabaseMigrationService implements OnModuleInit {
  private static readonly logger = new Logger('DatabaseMigrationService');

  private readonly tableName = 'database_migrations';

	constructor(@InjectDataSource() private readonly connection: Connection,
							private readonly configService: ConfigService<IDatabaseConfigParams>) {
	}

	public async onModuleInit(): Promise<void> {
		await this.migrateAuto();
	}

	public async migrateAuto(): Promise<void> {
		if (!(this.configService.get('NX_DATABASE_ENABLE_MIGRATIONS') === 'true')) {
			return;
		}

		await this.migrate(migrations);
	}

	public async migrate(migrationsList: InputMigrations<MigrationContext>): Promise<void> {
		const queryRunner = this.connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		let pendingMigrations: MigrationMeta[] = [];

		await this.createTableIfNotExist(queryRunner);

		await queryRunner.commitTransaction();
		await queryRunner.startTransaction();

		try {
			const umzug = new Umzug({
				migrations: migrationsList,
				context: () => ({
					queryRunner,
					logger: DatabaseMigrationService.logger,
				} as MigrationContext),
				storage: new TypeOrmUmzugStorage(),
				logger: {
					info: (message) => { DatabaseMigrationService.logger.log(message) },
					debug: (message) => { DatabaseMigrationService.logger.debug(message) },
					error: (message) => { DatabaseMigrationService.logger.error(message) },
					warn: (message) => { DatabaseMigrationService.logger.warn(message) }
				}
			});

			DatabaseMigrationService.logger.log('Migrations are enabled. Running...');
			pendingMigrations = await umzug.pending();

			if (pendingMigrations.length) {
				await umzug.up();

				DatabaseMigrationService.logger.log('Migrations complete');
			} else {
				DatabaseMigrationService.logger.log('No pending migrations found');
			}

      await queryRunner.commitTransaction();
		} catch (e) {
			if(e instanceof Error) {
				DatabaseMigrationService.logger.error('Exception occurred when migrating', e.message);
			}

			await queryRunner.rollbackTransaction();

			await queryRunner.manager.delete(DbMigration, {
				name: In(pendingMigrations.map((x) => x.name))
			});

		} finally {
			await queryRunner.release();
		}
	}

	private async createTableIfNotExist(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(new Table({
			name: this.tableName,
			columns: [
				{
					name: 'id',
					type: 'uuid',
					isPrimary: true,
					isGenerated: true,
					generationStrategy: 'uuid'
				},
				{
					name: 'migrated_at',
					type: 'timestamp'
				},
				{
					name: 'name',
					type: 'text'
				}
			]
		}), true);
	}
}
