import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	name: string;

	@Column()
	email: string;

	@Column()
	password: string;

	@CreateDateColumn({ type: 'timestamptz' })
	public createdAt: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	public updatedAt: Date;
}
