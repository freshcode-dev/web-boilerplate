import { MigrationParams, RunnableMigration } from 'umzug/lib/types';
import { MigrationContext } from '../utility-types';
import { Table } from 'typeorm';

export class CreateOtpTable20231109081259 implements RunnableMigration<MigrationContext> {
	public name = '20231109081259.CreateOtpTable';

	public async up(params: MigrationParams<MigrationContext>): Promise<void> {
		const { context: { queryRunner } } = params;

		await queryRunner.createTable(new Table({
			name: 'otp',
			columns: [
				{
					name: 'code',
					type: 'varchar',
					isPrimary: true,
					isGenerated: false,
				},
				{
					name: 'createdAt',
					type: 'timestamptz',
					default: 'now()',
					isNullable: false
				},
				{
					name: 'expiresAt',
					type: 'timestamptz',
					isNullable: false
				},
				{
					name: 'usedAt',
					type: 'timestamptz',
					isNullable: true
				},
				{
					name: 'assignee',
					type: 'varchar',
					isNullable: false
				}
			],
		}))
	}

	public async down(params: MigrationParams<MigrationContext>): Promise<void> {
		const { context: { queryRunner } } = params;

		await queryRunner.dropTable('otp');
	}
}
