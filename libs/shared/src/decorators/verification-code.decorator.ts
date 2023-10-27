import { Length } from 'class-validator';

export const VERIFICATION_CODE_LENGTH = 6;

export const VerificationCode = (): PropertyDecorator => (target, propertyKey) => {
	Length(VERIFICATION_CODE_LENGTH, VERIFICATION_CODE_LENGTH)(target, propertyKey);
};
