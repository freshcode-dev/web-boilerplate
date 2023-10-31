import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Session } from './session.entity';

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	name: string;

	@Column()
	email: string;

	@Column()
	phoneNumber: string;

	@Column()
	password: string;

	@OneToMany(() => Session, session => session.user)
	sessions: Session[];

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date;
}
