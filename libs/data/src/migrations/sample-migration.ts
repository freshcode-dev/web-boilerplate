import { MigrationParams, RunnableMigration } from 'umzug/lib/types';
import { MigrationContext } from '../utility-types';

export class ClassNameToBeReplaced implements RunnableMigration<MigrationContext> {
	public async down(params: MigrationParams<MigrationContext>): Promise<unknown> {
		return Promise.resolve(undefined);
	}

	public async up(params: MigrationParams<MigrationContext>): Promise<unknown> {
		return Promise.resolve(undefined);
	}

	public name = '__migration_name_to_be_replaced__';
}
