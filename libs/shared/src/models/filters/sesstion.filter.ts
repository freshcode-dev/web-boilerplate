import { Transform } from 'class-transformer';
import { transformStringToBooleanNullable } from '../../utils/transformers/string-to-boolean-nullable';

export class SessionFilter {
	@Transform(transformStringToBooleanNullable)
	withIpDetails?: boolean;
}
