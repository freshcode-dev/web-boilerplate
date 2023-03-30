import { Request } from 'express';
import { JwtPayload } from './jwt-payload';

export interface AuthRequest extends Request {
	user: JwtPayload;
}
