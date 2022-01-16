import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'database_migrations' })
export class DbMigration {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({type:'timestamp'})
	migrated_at: Date;

	@Column()
	name: string;
}
