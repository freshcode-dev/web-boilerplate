import { MigrationParams, RunnableMigration } from 'umzug/lib/types';
import { MigrationContext } from '../utility-types';
import { Table } from 'typeorm';

export class CreateUsersTable20220114133300 implements RunnableMigration<MigrationContext> {
  public name = '20220114133300.CreateUsersTable';

	public async up(params: MigrationParams<MigrationContext>): Promise<void> {
		const { context: { queryRunner } } = params;

		await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

		await queryRunner.createTable(new Table({
			name: 'users',
			columns: [
				{
					name: 'id',
					type: 'uuid',
					isPrimary: true,
					isGenerated: true,
					generationStrategy: 'uuid'
				},
				{
					name: 'name',
					type: 'text',
					isNullable: false
				},
				{
					name: 'email',
					type: 'text',
					isUnique: true,
					isNullable: false
				},
				{
					name: 'password',
					type: 'text',
					isNullable: false
				},
				{
					name: 'createdAt',
					type: 'timestamptz',
					default: 'now()',
					isNullable: false
				},
				{
					name: 'updatedAt',
					type: 'timestamptz',
					default: 'now()',
					isNullable: true
				},
			]
		}));
	}

	public async down(params: MigrationParams<MigrationContext>): Promise<void> {
		const { context: { queryRunner } } = params;

		await queryRunner.dropTable('users');
	}
}
