import { ValidateNested, isBase64 } from 'class-validator';
import { Transform, plainToInstance, ClassConstructor } from 'class-transformer';

const transform = <T extends object>(
	value: unknown,
	cursorClass: ClassConstructor<T>
): object | null => {
	if (typeof value !== 'string' || !isBase64(value)) {
		return null;
	}

	const dataStr = Buffer.from(value, 'base64').toString('utf-8');

	try {
		const plain = JSON.parse(dataStr);

		return plainToInstance(cursorClass, plain);
	} catch {
		return null;
	}
};

export const NextPageCursor = <T extends object>(cursorClass: ClassConstructor<T>): PropertyDecorator =>
	(target, propertyKey) => {
		Transform(({ value }) => transform(value, cursorClass))(target, propertyKey);
		ValidateNested()(target, propertyKey);
	};
