import { IsNotEmpty, IsString } from "class-validator";

export class AuthWithGoogle {
	@IsString()
	@IsNotEmpty()
	idToken: string;
}
