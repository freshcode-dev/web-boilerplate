import { Request } from 'express';
import { JwtPayload } from './jwt-payload';

export interface RequestWithAuth extends Request {
	user: JwtPayload;
}
