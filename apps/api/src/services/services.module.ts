import { Module } from '@nestjs/common';
import { DatabaseModule, User } from '@boilerplate/data';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtAuthGuard } from './guard/jwt.guard';
import { LocalStrategy } from './strategy/local.strategy';
import { jwtConstants } from '../constants';

@Module({
  imports: [
		DatabaseModule.forFeature([User]),
		PassportModule,
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: {
				expiresIn: jwtConstants.expiresIn
			}
		}),
  ],
  providers: [
    UsersService,
		AuthService,
		JwtStrategy,
		JwtAuthGuard,
		LocalStrategy,
  ],
  exports: [
    UsersService,
		AuthService,
  ],
})
export class ServicesModule {}
