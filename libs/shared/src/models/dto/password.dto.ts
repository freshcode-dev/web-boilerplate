import { Length } from "class-validator";

export class PasswordDto {
	@Length(8, 36)
	password: string;
}
