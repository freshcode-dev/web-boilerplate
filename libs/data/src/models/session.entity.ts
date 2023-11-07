import {
	Column,
	CreateDateColumn,
	Entity,
	Generated,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'sessions' })
export class Session {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	@Generated('uuid')
	tokenId: string;

	@Column()
	rememberMe: boolean;

	@Column({ type: 'timestamptz' })
	expiredAt: Date;

	@Column({ select: false })
	userId: string;

	@Column()
	ipAddress: string;

	@Column()
	userAgent: string;

	@ManyToOne(() => User, user => user.sessions)
	user?: User;

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date;
}
