import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserDto } from '@boilerplate/shared';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: 'email'
        });
    }

    public async validate(email: string, password: string): Promise<UserDto | undefined> {
        const { user, error, message } = await this.authService.validateUser(email, password);

        if (!user && error)
            throw new UnauthorizedException(message);

        return user;
    }
}
