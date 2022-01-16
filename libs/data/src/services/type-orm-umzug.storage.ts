import { UmzugStorage } from 'umzug/lib/storage/contract';
import { MigrationContext } from '../utility-types';
import { MigrationParams } from 'umzug/lib/types';
import { DbMigration } from '../models/db-migration.entity';

export class TypeOrmUmzugStorage implements UmzugStorage<MigrationContext> {
	public async executed(meta: Pick<MigrationParams<MigrationContext>, "context">): Promise<string[]> {
		const migrations: DbMigration[] = await meta.context.queryRunner.manager.find(DbMigration);

		return migrations.map(x => x.name);
	}

	public async logMigration(params: MigrationParams<MigrationContext>): Promise<void> {
		await params.context.queryRunner.manager.insert(DbMigration, {migrated_at: new Date(), name: params.name});
	}

	public async unlogMigration(params: MigrationParams<MigrationContext>): Promise<void> {
		await params.context.queryRunner.manager.delete(DbMigration, {name: params.name});
	}
}
