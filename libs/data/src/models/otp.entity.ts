import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('otp')
export class OTPEntity {
	@PrimaryColumn()
	code: string;

	@Column()
	createdAt: Date;

	@Column()
	expiresAt: Date;

	@Column({ nullable: true })
	usedAt?: Date;

	@Column()
	assignee: string;
}
