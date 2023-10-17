import { MigrationParams, RunnableMigration } from 'umzug/lib/types';
import { MigrationContext } from '../utility-types';
import { Table, TableForeignKey } from 'typeorm';

export class Session20230226154759 implements RunnableMigration<MigrationContext> {
	public name = '20230226154759.Session';

	public async up(params: MigrationParams<MigrationContext>): Promise<void> {
		const { context: { queryRunner } } = params;

		await queryRunner.createTable(new Table({
			name: 'sessions',
			columns: [
				{
					name: 'id',
					type: 'uuid',
					isPrimary: true,
					isGenerated: true,
					generationStrategy: 'uuid'
				},
				{
					name: 'tokenId',
					type: 'uuid',
					isGenerated: true,
					generationStrategy: 'uuid',
					isNullable: false
				},
				{
					name: 'userId',
					type: 'uuid',
					isNullable: false
				},
				{
					name: 'expiredAt',
					type: 'timestamptz',
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

		await queryRunner.createForeignKey('sessions', new TableForeignKey({
			name: 'FK_users_userId',
			columnNames: ['userId'],
			referencedColumnNames: ['id'],
			referencedTableName: 'users',
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE'
		}));
	}

	public async down(params: MigrationParams<MigrationContext>): Promise<void> {
		const { context: { queryRunner } } = params;

		await queryRunner.dropForeignKey('sessions', 'FK_users_userId');
		await queryRunner.dropTable('sessions');
	}
}
